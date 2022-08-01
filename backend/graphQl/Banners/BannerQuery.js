const Banner = require("../../database/models/BannerModel")

module.exports.BannerList = {
    query: `bannerList: [Banner]`,
    resolve() {
        return Banner.find({});
    }
}

