const {GraphQLObjectType, GraphQLString, GraphQLFloat,  GraphQLInt} = require("graphql");

module.exports = new GraphQLObjectType({
    name: 'ProductionRating',
    fields: () => ({
        _id: {type: GraphQLString},
        movieId: {type: GraphQLString},
        userId: {type: GraphQLString},
        rating: {type: GraphQLInt},
    })
});


const RatingType = new GraphQLObjectType({
    name: 'Rating',
    fields: () => ({
        rate: {type: GraphQLFloat},
        numberOfRates: {type: GraphQLFloat},
    })
})

const SeeAlsoType = new GraphQLObjectType({
    name: 'SeeAlso',
    fields: () => ({
        productionId: {type: GraphQLString},
    })
})