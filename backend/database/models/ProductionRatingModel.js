const mongoose = require("mongoose");

module.exports = mongoose.model('ratings', {
    productionId: {type: String},
    userId:  String,
    rating: Number
})