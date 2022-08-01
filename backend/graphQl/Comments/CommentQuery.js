const Comment = require("../../database/models/CommentModel")


module.exports.NumberOfComments = {
    query: `numberOfComments(productionId:String): Int`,
    async resolve(parent, args) {
        return Comment.count({productionId: args.productionId});
    }
}

module.exports.CommentList = {
    query: `commentList(productionId:String,page:Int,pageSize:Int): [Comment]`,
    async resolve(parent, args) {
        const {productionId, page, pageSize} = args;
        return  Comment.find({productionId: productionId})
            .skip((parseInt(page) - 1) * parseInt(pageSize))
            .limit(pageSize)
            .sort({'date': -1})
            .select("content date userId");
    }
}