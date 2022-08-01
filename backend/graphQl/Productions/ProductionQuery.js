const Movie = require("../../database/models/ProductionModel");
const getFields = require('../../components/getFields')

module.exports.NumberOfProductions = {
    query: "numberOfProductions(category:String):Int",
    async resolve(parent, args) {
        return await Movie.count({category: args.category});
    }
};

module.exports.ProductionList = {
    query: `productionList(page:Int, pageSize:Int, orderBy:String, descending:String, category:String): [Production]`,
    async resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'Productions');
        let {orderBy = 'rating', descending: sort = 'true'} = args;
        sort = sort === 'true' ? '-1' : '1';
        orderBy = orderBy === 'rating' ? {'rating.rate': sort} : orderBy === 'release date' ? {'releaseDate': sort} : {'rating.numberOfRates': sort};

        return await Movie.find(args.category && {category: args.category})
            .select(fieldsToSelect)
            .skip(args.page && args.pageSize ? parseInt(args.page - 1) * parseInt(args.pageSize) : 0)
            .limit(args.pageSize ? args.pageSize : 500)
            .sort(orderBy);
    }
}

module.exports.SearchProduction = {
    query: `searchProduction(name:String): [Production]`,
   async resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'Productions');
        if (args.name)
            return await Movie.find({name: {$regex: args.name, $options: 'i'}}).select(fieldsToSelect);
    }
}

module.exports.SingleProduction = {
    query: `production(name:String): Production`,
    async resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'Productions');
        if (args.name)
            return Movie.findOne({name: {$regex: args.name, $options: 'i'}}).select(fieldsToSelect);
    }
}