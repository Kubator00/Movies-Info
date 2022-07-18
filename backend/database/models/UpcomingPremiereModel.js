const mongoose = require("mongoose");

module.exports = mongoose.model('premieres', {
    movieId: {
        type: String
    }
})