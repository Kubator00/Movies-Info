const mongoose = require("mongoose");

module.exports = mongoose.model('news', {
    name: {
        type: String
    },
    img: {
        type: String
    },
    content: {
        type: String
    },
    backgroundImg: {
        type: String
    },
    author:{
        type:String
    }
})