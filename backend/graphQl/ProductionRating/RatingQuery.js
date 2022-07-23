const {GraphQLString} = require("graphql");
const MovieRating = require("../../database/models/MovieRating")
const getUserId = require("../../components/getUserId");
const userAuthorization = require("../../components/userAuthorization");
const RatingType = require('./RatingType')

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
        let userId;
        try {
            userId = await getUserId(userEmail);
            await userAuthorization(userId, userToken);
        } catch (err) {
            throw err;
        }
        return MovieRating.findOne({userId: userId, movieId: productionId});

    }
}

