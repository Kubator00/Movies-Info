const {GraphQLObjectType, GraphQLString} = require("graphql");

module.exports = new GraphQLObjectType({
    name: 'News',
    fields: () => ({
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        backgroundImg: {type: GraphQLString},
        img: {type: GraphQLString},
        htmlContent: {type: GraphQLString},
        author: {type: GraphQLString},
        date: {type: GraphQLString},
    })
});
