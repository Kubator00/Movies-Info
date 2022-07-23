const {GraphQLObjectType, GraphQLString} = require("graphql");


module.exports = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: {type: GraphQLString},
        email: {type: GraphQLString},
        login: {type: GraphQLString},
        password: {type: GraphQLString},
        isAdmin: {type: GraphQLString},
        registerDate: {type: GraphQLString},
        token: {type: GraphQLString},
    })
});
