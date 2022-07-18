const mongoose = require("mongoose");

module.exports = mongoose.model('users', {
    email: {
        type: String
    },
    login: {
        type: String
    },
    password: {
        type: String
    },
    registerData: {
        type: Date
    },
    isAdmin: {
        type: Boolean
    }

})