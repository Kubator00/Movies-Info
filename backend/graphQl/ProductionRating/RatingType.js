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


