const mongoose = require("mongoose");

module.exports = mongoose.model('productions', {
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
    duration: {
        type: Object
    },
    backgroundImg: {
        type: String
    },
    posterImg: {
        type: String
    },
    directoryName: {
        type: String
    },
    category: {
        type: String
    },
    seeAlso: [
        {
            productionId: {type: String}
        }
    ]
})