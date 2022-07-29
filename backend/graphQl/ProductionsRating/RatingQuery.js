const {GraphQLString} = require("graphql");
const RatingType = require('./RatingType')
const ProductionRating = require("../../database/models/ProductionRatingModel")
const getUserId = require("../../components/getUserId");
const userAuthorization = require("../../components/userAuthorization");

module.exports.ProductionRating = {
    type: RatingType,
    name: 'Production rating',
    description: 'Return a production rating by user',
    args: {
        productionId: {type: GraphQLString},
        userToken: {type: GraphQLString},
        userEmail: {type: GraphQLString},
    },
    async resolve(parent, args) {
        const {productionId, userToken, userEmail} = args;
        const userId = await getUserId(userEmail);
        await userAuthorization(userId, userToken);

        return ProductionRating.findOne({userId: userId, productionId: productionId});

    }
}

