const {GraphQLObjectType, GraphQLString} = require('graphql');
const User = require('../../database/models/UserModel');
const UserType = require('../Users/UserType')


module.exports = new GraphQLObjectType({
    name: 'Comments',
    fields: () => (
        {
            _id: {type: GraphQLString},
            productionId: {type: GraphQLString},
            userId: {type: GraphQLString},
            content: {type: GraphQLString},
            date: {type: GraphQLString},
            user: {
                type: UserType,
                resolve: (parent, args) => {
                    return User.findById(parent.userId).select('_id email login');
                }
            }
        })
});