const mongoose = require("mongoose");

module.exports = mongoose.model('production_comments', {
    productionId: {
        type: String
    },
    userId: {
        type: String
    },
    content: {
        type: String
    },
    date: {
        type: Date
    },

})