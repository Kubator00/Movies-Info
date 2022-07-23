const {GraphQLList, GraphQLString, GraphQLInt} = require("graphql");
const CommentType = require("./CommentType")
const Comment = require("../../database/models/CommentModel")


module.exports.NumberOfComments = {
    type: GraphQLInt,
    name: 'Number of comments',
    description: 'Return number of comments',
    args: {
        productionId: {type: GraphQLString},
    },
    resolve(parent, args) {
        return Comment.count({productionId: args.productionId});
    }
}

module.exports.CommentList = {
    type: new GraphQLList(CommentType),
    name: "Comment List",
    description: 'Return comments of the given production',
    args: {
        productionId: {type: GraphQLString},
        page: {type: GraphQLInt},
        pageSize: {type: GraphQLInt}
    },
    resolve(parent, args) {
        const {productionId, page, pageSize} = args;
        return Comment.find({productionId: productionId})
            .skip((parseInt(page) - 1) * parseInt(pageSize))
            .limit(pageSize)
            .sort({'date': -1})
            .select("content date userId");

    }
}