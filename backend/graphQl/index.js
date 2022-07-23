const {
    GraphQLSchema,
    GraphQLObjectType,
} = require('graphql');

const ProductionQuery = require('./Production/ProductionQuery');
const NewsQuery = require('./News/NewsQuery');
const BannerQuery = require('./Banners/BannerQuery');
const UpcomingPremiersQuery = require('./UpcomingPremiers/UpcomingPremiersQuery');
const CommentQuery = require('./Comments/CommentQuery');
const RecommendedProductionsQuery = require('./ReccomendedProductions/ReccomendedProductionsQuery');
const UserMutation = require('./Users/UserMutation');
const CommentMutation = require('./Comments/CommentMutation');
const RatingQuery = require('./ProductionRating/RatingQuery');
const RatingMutation = require('./ProductionRating/RatingMutation');

const RootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
        productionList: ProductionQuery.ProductionList,
        numberOfProductions: ProductionQuery.NumberOfProductions,
        production: ProductionQuery.SingleProduction,
        searchProduction: ProductionQuery.SearchProduction,
        newsList: NewsQuery.NewsList,
        news: NewsQuery.SingleNews,
        bannerList: BannerQuery.BannerList,
        upcomingPremiersList: UpcomingPremiersQuery.UpcomingPremiersList,
        commentList: CommentQuery.CommentList,
        numberOfComments: CommentQuery.NumberOfComments,
        recommendedProductionsList: RecommendedProductionsQuery.RecommendedProductionsList,
        productionRating: RatingQuery.ProductionRating,
    }
})


const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        login: UserMutation.Login,
        register: UserMutation.Register,
        addComment: CommentMutation.AddComment,
        deleteComment: CommentMutation.DeleteComment,
        addRating: RatingMutation.AddRating
    })
})

module.exports.RootSchema = RootSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});

