const jwt = require('jsonwebtoken');
const PRIVATE_KEY = require('../index').PRIVATE_KEY;

module.exports = (userToken, userId) => {
    return (() => {
        jwt.verify(userToken, PRIVATE_KEY, (err, res) => {
            if (err)
                return false;
            return res.id === userId
        });
    })
}