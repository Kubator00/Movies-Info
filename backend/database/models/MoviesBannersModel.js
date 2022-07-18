const mongoose = require("mongoose");

module.exports = mongoose.model('banners', {
    _id: {
        type: mongoose.Types.ObjectId
    },
    name: {
        type: String
    },
    banner: {
        type: String
    }
})