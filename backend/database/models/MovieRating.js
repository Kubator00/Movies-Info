const mongoose = require("mongoose");

module.exports = mongoose.model('ratings', {
    movieId: {type: String},
    userId:  String,
    rating: Number
})