const mongoose = require("mongoose");

module.exports = mongoose.model('news', {
    _id:{
        type: mongoose.Types.ObjectId
    },

    name: {
        type: String
    },
    img: {
        type: String
    },
    htmlContent: {
        type: String
    },
    backgroundImg: {
        type: String
    },
    author:{
        type:String
    },
    date:{
        type:Date
    }
})