const ProductionRating = require("../../database/models/ProductionRatingModel")

module.exports.ProductionRating = {
    query: `productionRating(productionId:String, userToken:String, userEmail:String): UserRating`,
    async resolve(parent, args) {
        const {productionId, userId} = args;
        return await ProductionRating.findOne({userId: userId, productionId: productionId})
    }
}
