const { GraphQLString, GraphQLInt} = require("graphql");

const userAuthorization = require('../../components/userAuthorization')
const ProductionRating = require('../../database/models/ProductionRatingModel')
const Production = require('../../database/models/ProductionModel')
const getUserId = require('../../components/getUserId')
const mongoose = require("mongoose");
const RatingType = require("./RatingType");

module.exports.AddRating = {
    type: RatingType,
    name: 'Add rating',
    description: 'Add new rating to production',
    args: {
        productionId: {type: GraphQLString},
        userToken: {type: GraphQLString},
        userEmail: {type: GraphQLString},
        newRating: {type: GraphQLInt},
    },
    async resolve(parent, args) {
        const {productionId, userToken, userEmail, newRating} = args;
        let userId;
        try {
            userId = await getUserId(userEmail);
            await userAuthorization(userId, userToken);
        } catch (err) {
            throw err;
        }

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

