const mongoose = require("mongoose");

module.exports = mongoose.model('premieres_upcoming', {
    _id:{
        type: mongoose.Types.ObjectId
    },
    productionId: {
        type: String
    }
})