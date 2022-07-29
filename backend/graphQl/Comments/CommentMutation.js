const {GraphQLString} = require("graphql");
const Comment = require("../../database/models/CommentModel")
const userAuthorization = require('../../components/userAuthorization')
const getUserId = require('../../components/getUserId')
const mongoose = require("mongoose");

module.exports.AddComment = {
    type: GraphQLString,
    name: 'Add Comment',
    description: 'Add comment to production',
    args: {
        productionId: {type: GraphQLString},
        userToken: {type: GraphQLString},
        userEmail: {type: GraphQLString},
        content: {type: GraphQLString},
    },
    async resolve(parent, args) {
        const {productionId, userToken, userEmail, content} = args;
        const userId = await getUserId(userEmail);
        await userAuthorization(userId, userToken);
        
        const comment = new Comment({
            _id: new mongoose.Types.ObjectId(),
            productionId: productionId,
            userId: userId,
            content: content,
            date: new Date()
        });

        try {
            await comment.save();
        } catch (err) {
            console.error(err)
            throw new Error('Error occurred')
        }
        return 'success';
    }
}

module.exports.DeleteComment = {
    type: GraphQLString,
    name: 'Delete Comment',
    description: 'Delete specified comment',
    args: {
        commentId: {type: GraphQLString},
        userToken: {type: GraphQLString},
        userEmail: {type: GraphQLString},
    },
    async resolve(parent, args) {
        const {commentId, userToken, userEmail} = args;
        const userId = await getUserId(userEmail);
        await userAuthorization(userId, userToken);

        try {
            await Comment.deleteOne({_id: commentId});
        } catch (err) {
            console.error(err)
            throw new Error('Error occurred')
        }
        return 'Success';
    }
}
