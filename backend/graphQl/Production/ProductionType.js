const {GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLList, GraphQLInt} = require("graphql");
const CommentType = require('../Comments/CommentType')
const Comment = require('../../database/models/CommentModel')

module.exports = new GraphQLObjectType({
    name: 'Production',
    fields: () => ({
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        category: {type: GraphQLString},
        releaseDate: {type: GraphQLString},
        shortDescription: {type: GraphQLString},
        directors: {type: GraphQLString},
        mainStars: {type: GraphQLString},
        writers: {type: GraphQLString},
        trailerUrl: {type: GraphQLString},
        directoryName: {type: GraphQLString},
        rating: {type: RatingType},
        seeAlso: {type: new GraphQLList(SeeAlsoType)},
        comments: {
            type: new GraphQLList(CommentType),
            args: {
                page: {type: GraphQLInt},
                pageSize: {type: GraphQLInt}
            },
            resolve: (parent, args) => {
                return Comment.find({productionId: parent._id.toString()})
                    .skip((parseInt(args.page) - 1) * parseInt(args.pageSize))
                    .limit(args.pageSize)
                    .sort({'date': -1})
                    .select("content date userId");
            }
        }
    })
});


const RatingType = new GraphQLObjectType({
    name: 'Rating',
    fields: () => ({
        rate: {type: GraphQLFloat},
        numberOfRates: {type: GraphQLFloat},
    })
})

const SeeAlsoType = new GraphQLObjectType({
    name: 'SeeAlso',
    fields: () => ({
        productionId: {type: GraphQLString},
    })
})