const {GraphQLList, GraphQLString, GraphQLInt} = require("graphql");
const {parseResolveInfo} = require("graphql-parse-resolve-info");
const News = require("../../database/models/NewsModel");
const NewsType = require('./NewsType');
const SORT_TYPE = require('../../const/SORT_TYPES')
const getFields = require('../../components/getFields')

module.exports.NewsList = {
    name: "News list",
    description: "Return a list of the latest news",
    type: new GraphQLList(NewsType),
    args: {
        name: {type: GraphQLString},
        limit: {type: GraphQLInt},
        sort: {type: GraphQLString}
    },
    resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'News');
        return News.find().select(fieldsToSelect).limit(args.limit).sort({date: SORT_TYPE[args.sort]});
    }
}

module.exports.SingleNews = {
    name: "News content",
    description: "Return a single news",
    type: NewsType,
    args: {
        id: {type: GraphQLString},
    },
    resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'News');
        return News.findById(args.id).select(fieldsToSelect);
    }
}