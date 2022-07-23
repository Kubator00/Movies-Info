const {GraphQLList, GraphQLString, GraphQLInt} = require("graphql");
const BannerType = require("./BannerType")
const Banner = require("../../database/models/BannersModel")

module.exports.BannerList = {
    type: new GraphQLList(BannerType),
    name: "Banner List",
    description: "Return a list of productions banners",
    resolve() {
        return Banner.find({});
    }
}

