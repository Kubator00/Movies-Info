const {GraphQLList} = require("graphql");
const UpcomingPremiersType = require("./UpcomingPremiersType")
const UpcomingPremiers = require("../../database/models/UpcomingPremiereModel")

module.exports.UpcomingPremiersList = {
    name:"Upcoming premieres list",
    description:"Return productions, which premiers is upcoming",
    type: new GraphQLList(UpcomingPremiersType),
    resolve() {
        return UpcomingPremiers.find({});
    }
}

