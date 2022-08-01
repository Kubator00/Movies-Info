const ProductionRating = require('../../database/models/ProductionRatingModel')
const Production = require('../../database/models/ProductionModel')
const mongoose = require("mongoose");


module.exports.AddRating = {
    mutation:'addRating(productionId:String, newRating:Int, userToken:String, userEmail:String): UserRating',
    async resolve(parent, args) {
        const {productionId, newRating,userId} = args;
        let a, b;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            a = await ProductionRating
                .findOne({'userId': userId, 'productionId': productionId})
            if (a) {
                a.rating = newRating;
            } else {
                a = new ProductionRating(
                    {
                        productionId: productionId,
                        userId: userId,
                        rating: newRating,
                    }
                )
            }
            await a.save();
            b = await ProductionRating.find({'productionId': productionId});
            const avg = b.reduce((c, d) => c + d.rating, 0) / b.length;
            const c = await Production.findById(productionId);
            c.rating.rate = avg;
            c.rating.numberOfRates = b.length;
            await c.save();
            await session.commitTransaction();
        } catch (error) {
            console.error(error)
            await session.abortTransaction();
            throw new Error('Error occurred');
        } finally {
            session.endSession();
        }

        return ProductionRating.findOne({userId: userId, productionId: productionId});
    }
}

