const {ApolloServer, gql} = require('apollo-server-express');
const {makeExecutableSchema} = require('@graphql-tools/schema')
const {applyMiddleware} = require("graphql-middleware");
const {graphqlUploadExpress} = require("graphql-upload");
const PORT = require('../const/SERVER_PORT');
const getUserId = require("../components/getUserId");
const userAuthorization = require("../components/userAuthorization");

const User = require('../database/models/UserModel');
const Production = require('../database/models/ProductionModel');

//types
const ProductionType = require('./Productions/ProductionType');
const RatingType = require('./Productions/RatingType');
const NewsType = require('./News/NewsType');
const UserType = require('./Users/UserType');
const CommentType = require('./Comments/CommentType');
const UserRatingType = require('./ProductionsRating/RatingType');
const UpcomingPremiereType = require('./UpcomingPremiers/UpcomingPremiersType');
const BannerType = require('./Banners/BannerType');
const UploadType = require('./Upload/UploadType');

//queries
const {
    SingleProduction,
    ProductionList,
    SearchProduction,
    NumberOfProductions
} = require("./Productions/ProductionQuery");
const {NewsList, SingleNews} = require("./News/NewsQuery");
const {NumberOfComments, CommentList} = require("./Comments/CommentQuery");
const {ProductionRating} = require("./ProductionsRating/RatingQuery");
const {UpcomingPremiersList} = require("./UpcomingPremiers/UpcomingPremiersQuery");
const {RecommendedProductionsList} = require("./ReccomendedProductions/ReccomendedProductionsQuery");
const {BannerList} = require("./Banners/BannerQuery");

//mutations
const {Login, Register, ChangePassword, ChangeEmail} = require("./Users/UserMutation");
const {AddComment, DeleteComment} = require("./Comments/CommentMutation");
const {AddRating} = require("./ProductionsRating/RatingMutation");
const {UploadFile} = require("./Upload/UploadQuery");
const express = require("express");


const typeDef = gql`
   ${RatingType}
   ${ProductionType}
   ${NewsType}
   ${UserType}
   ${CommentType}
   ${UserRatingType}
   ${UpcomingPremiereType}
   ${BannerType}
   ${UploadType}
   
  type Query{
        ${SingleProduction.query}
        ${ProductionList.query}
        ${SearchProduction.query}
        ${NumberOfProductions.query}
        ${NewsList.query}
        ${SingleNews.query}
        ${NumberOfComments.query}
        ${CommentList.query}
        ${UpcomingPremiersList.query}
        ${RecommendedProductionsList.query}
        ${BannerList.query}

        ${ProductionRating.query}
  }
  
  type Mutation{
    ${Login.mutation}
    ${Register.mutation}

    ${AddComment.mutation}
    ${DeleteComment.mutation}
    ${ChangePassword.mutation}
    ${ChangeEmail.mutation}
    ${AddRating.mutation}
    ${UploadFile.mutation}
    
  }`
;


const resolvers = {
    Query: {
        production: async (parent, args, context, resolveInfo) => await SingleProduction.resolve(parent, args, context, resolveInfo),
        productionList: async (parent, args, context, resolveInfo) => await ProductionList.resolve(parent, args, context, resolveInfo),
        searchProduction: async (parent, args, context, resolveInfo) => await SearchProduction.resolve(parent, args, context, resolveInfo),
        numberOfProductions: async (parent, args, context, resolveInfo) => await NumberOfProductions.resolve(parent, args, context, resolveInfo),
        newsList: async (parent, args, context, resolveInfo) => await NewsList.resolve(parent, args, context, resolveInfo),
        news: async (parent, args, context, resolveInfo) => await SingleNews.resolve(parent, args, context, resolveInfo),
        numberOfComments: async (parent, args, context, resolveInfo) => await NumberOfComments.resolve(parent, args, context, resolveInfo),
        commentList: async (parent, args, context, resolveInfo) => await CommentList.resolve(parent, args, context, resolveInfo),
        upcomingPremiersList: async (parent, args, context, resolveInfo) => await UpcomingPremiersList.resolve(parent, args, context, resolveInfo),
        recommendedProductionList: async (parent, args, context, resolveInfo) => await RecommendedProductionsList.resolve(parent, args, context, resolveInfo),
        bannerList: async (parent, args, context, resolveInfo) => await BannerList.resolve(parent, args, context, resolveInfo),

        productionRating: async (parent, args, context, resolveInfo) => await ProductionRating.resolve(parent, args, context, resolveInfo),
    },
    Mutation: {
        login: async (parent, args, context, resolveInfo) => await Login.resolve(parent, args, context, resolveInfo),
        register: async (parent, args, context, resolveInfo) => await Register.resolve(parent, args, context, resolveInfo),

        changePassword: async (parent, args, context, resolveInfo) => await ChangePassword.resolve(parent, args, context, resolveInfo),
        changeEmail: async (parent, args, context, resolveInfo) => await ChangeEmail.resolve(parent, args, context, resolveInfo),
        addComment: async (parent, args, context, resolveInfo) => await AddComment.resolve(parent, args, context, resolveInfo),
        deleteComment: async (parent, args, context, resolveInfo) => await DeleteComment.resolve(parent, args, context, resolveInfo),
        addRating: async (parent, args, context, resolveInfo) => await AddRating.resolve(parent, args, context, resolveInfo),
        uploadFile: async (parent, args, context, resolveInfo) => await UploadFile.resolve(parent, args, context, resolveInfo),
    },


    Comment: {
        user: async (parent, args, context, info) => {
            return User.findById(parent.userId).select('_id email login');
        },
    },
    UpcomingPremiere: {
        production: async (parent, args, context, info) => {
            return Production.findById(parent.productionId);
        }
    }

};


const authMiddleware = async (resolve, root, args, context, info) => {
    const {userEmail, userToken} = args;
    args.userId = await getUserId(userEmail);
    await userAuthorization(args.userId, userToken);
    return await resolve(root, args, context, info);
}

const middleware = {
    Query: {
        productionRating: async (resolve, parent, args, context, info) => await authMiddleware(resolve, parent, args, context, info),
    },
    Mutation: {
        changePassword: async (resolve, parent, args, context, info) => await authMiddleware(resolve, parent, args, context, info),
        changeEmail: async (resolve, parent, args, context, info) => await authMiddleware(resolve, parent, args, context, info),
        addComment: async (resolve, parent, args, context, info) => await authMiddleware(resolve, parent, args, context, info),
        deleteComment: async (resolve, parent, args, context, info) => await authMiddleware(resolve, parent, args, context, info),
        addRating: async (resolve, parent, args, context, info) => await authMiddleware(resolve, parent, args, context, info),
        uploadFile: async (resolve, parent, args, context, info) => await authMiddleware(resolve, parent, args, context, info),
    }
}


const schema = makeExecutableSchema({typeDefs: typeDef, resolvers: resolvers})
const schemaWithMiddleware = applyMiddleware(schema, middleware);


module.exports.startGraphQlServer = async function () {
    const graphqlServer = new ApolloServer(
        {schema: schemaWithMiddleware}
    );
    await graphqlServer.start();
    const graphqlApp = express();
    graphqlApp.use(graphqlUploadExpress());
    graphqlServer.applyMiddleware({app: graphqlApp});
    await new Promise((r) => graphqlApp.listen({port: PORT + 1}, r));
    console.log(`Graphql server is listening on port ${PORT + 1}`);
}


