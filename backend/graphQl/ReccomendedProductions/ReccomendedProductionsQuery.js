const Production = require("../../database/models/ProductionModel");
const getRandomInt = require("../../components/getRandomInt");


module.exports.RecommendedProductionsList = {
    query:`recommendedProductionList(productionId:String, limit: Int): [Production]`,
    async resolve(parent, args) {
        const {productionId,limit = 4} = args;
        let result = [];
        let instance = await Production.findById(productionId);
        if (!instance?.seeAlso || instance.seeAlso.length < 1) {
            let productionsNumber = await Production.count({});
            let randomNumbers = [];
            for (let i = 0; i < parseInt(limit); i++) {
                let number = getRandomInt(0, productionsNumber);
                randomNumbers.filter(element => element === number).length < 1 ? randomNumbers.push(number) : i -= 1;
            }
            for (let rand of randomNumbers) {
                const production = await Production.findOne().skip(rand).limit(1).select("name directoryName category");
                result.push(production);
            }
            return result;
        }
        for await(const production of instance.seeAlso) {
            const a = await Production.findById(production.productionId).select("name directoryName category");
            result.push(a);
        }
        return result;
    }
}

