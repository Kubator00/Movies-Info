const News = require("../../database/models/NewsModel");
const SORT_TYPE = require('../../const/SORT_TYPES')
const getFields = require('../../components/getFields')

module.exports.NewsList = {
    query: `newsList(limit:Int, sort:String): [News] `,
    async resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'News');
        return News.find().select(fieldsToSelect).limit(args.limit).sort({date: SORT_TYPE[args.sort]});
    }
}

module.exports.SingleNews = {
    query: `news(id: String): News`,
    async resolve(parent, args, context, resolveInfo) {
        const fieldsToSelect = getFields(resolveInfo, 'News');
        return News.findById(args.id).select(fieldsToSelect);
    }
}