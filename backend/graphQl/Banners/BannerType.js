const {GraphQLObjectType, GraphQLString} = require("graphql");

module.exports = new GraphQLObjectType({
    name: 'Banner',
    fields: () => ({
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        banner: {type: GraphQLString},
    })
});
