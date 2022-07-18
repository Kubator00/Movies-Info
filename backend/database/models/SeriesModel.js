const mongoose = require("mongoose");

module.exports = mongoose.model('series', {
    _id: {
        type: mongoose.Types.ObjectId
    },
    name: {
        type: String
    },
    nameUrl: {
        type: String
    },
    releaseDate: {
        type: Date
    },
    rating: {
        rate: Number,
        numberOfRates: Number
    },
    writers: {
        type: String
    },
    mainStars: {
        type: String
    },
    shortDescription: {
        type: String
    },
    directoryName: {
        type: String
    },
    numberOfEpisodes: {
        type: Number
    },
    category:{
        type: String
    }
})