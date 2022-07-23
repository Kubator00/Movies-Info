const {GraphQLList, GraphQLString, GraphQLInt} = require("graphql");
const Movie = require("../../database/models/MovieModel");
const ProductionType = require("../Production/ProductionType");
const getRandomInt = require("../../components/getRandomInt");


module.exports.RecommendedProductionsList = {
    type: new GraphQLList(ProductionType),
    name: 'Recommended Production List',
    description: 'Return recommend products based on productionId passed in argument or if not passed return random productions',
    args: {
        productionId: {type: GraphQLString},
        limit: {type: GraphQLInt}
    },
    async resolve(parent, args) {
        const {productionId,limit = 4} = args;
        let result = [];
        let instance = await Movie.findById(productionId);
        if (!instance?.seeAlso || instance.seeAlso.length < 1) {
            let productionsNumber = await Movie.count({});
            let randomNumbers = [];
            for (let i = 0; i < parseInt(limit); i++) {
                let number = getRandomInt(0, productionsNumber);
                randomNumbers.filter(element => element === number).length < 1 ? randomNumbers.push(number) : i -= 1;
            }
            for (let rand of randomNumbers) {
                const production = await Movie.findOne().skip(rand).limit(1).select("name directoryName category");
                result.push(production);
            }
            return result;
        }
        for await(const production of instance.seeAlso) {
            const a = await Movie.findById(production.productionId).select("name directoryName category");
            result.push(a);
        }
        return result;
    }
}

