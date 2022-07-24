const {GraphQLList, GraphQLString, GraphQLInt} = require("graphql");
const Movie = require("../../database/models/ProductionModel");
const ProductionType = require("./ProductionType")
const getFields = require('../../components/getFields')

module.exports.NumberOfProductions = {
    type: GraphQLInt,
    name: 'Number of productions',
    description: 'Return number of productions',
    args: {
        category: {type: GraphQLString}
    },
    resolve(parent, args) {
        return Movie.count({category: args.category});
    }
};

module.exports.ProductionList = {
    type: new GraphQLList(ProductionType),
    name: 'Product list',
    description: 'List of all productions',
    args: {
        page: {type: GraphQLInt},
        pageSize: {type: GraphQLInt},
        orderBy: {type: GraphQLString},
        descending: {type: GraphQLString},
        category: {type: GraphQLString}
    },
    resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'Production');
        let {orderBy = 'rating', descending: sort = 'true'} = args;
        sort = sort === 'true' ? '-1' : '1';
        orderBy = orderBy === 'rating' ? {'rating.rate': sort} : orderBy === 'release date' ? {'releaseDate': sort} : {'rating.numberOfRates': sort};

        return Movie.find(args.category && {category: args.category})
            .select(fieldsToSelect)
            .skip(args.page && args.pageSize ? parseInt(args.page - 1) * parseInt(args.pageSize) : 0)
            .limit(args.pageSize ? args.pageSize : 500)
            .sort(orderBy);
    }
}

module.exports.SearchProduction = {
    name: 'Search production',
    description: 'Find production by name',
    type: new GraphQLList(ProductionType),
    args: {
        name: {type: GraphQLString}
    },
    resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'Production');
        if (args.name)
            return Movie.find({name: {$regex: args.name, $options: 'i'}}).select(fieldsToSelect);
    }
}

module.exports.SingleProduction = {
    name: 'Product info',
    type: ProductionType,
    description: 'Find production by name',
    args: {
        name: {type: GraphQLString}
    },
    resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'Production');
        if (args.name)
            return Movie.findOne({name: {$regex: args.name, $options: 'i'}}).select(fieldsToSelect);
    }
}