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
    registerDate: {
        type: Date
    },
    isAdmin: {
        type: Boolean
    }

})