const Comment = require("../../database/models/CommentModel")
const mongoose = require("mongoose");

module.exports.AddComment = {
    mutation: `addComment(productionId:String, userToken:String, userEmail:String, content:String): String`,
    async resolve(parent, args) {
        const {productionId, content, userId} = args;
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
    mutation: `deleteComment(commentId:String, userToken:String, userEmail:String): String`,
    async resolve(parent, args) {
        const {commentId} = args;
        try {
            await Comment.deleteOne({_id: commentId});
        } catch (err) {
            console.error(err)
            throw new Error('Error occurred')
        }
        return 'Success';
    }
}
