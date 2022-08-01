const UpcomingPremiers = require("../../database/models/UpcomingPremiereModel")

module.exports.UpcomingPremiersList = {
   query:`upcomingPremiersList: [UpcomingPremiere]`,
    async resolve() {
        return UpcomingPremiers.find({});
    }
}

