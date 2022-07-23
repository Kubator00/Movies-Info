const verifyUserToken = require('./verifyToken')


module.exports = async (id,token) => {
    if (!verifyUserToken(token, id))
        throw new Error("User token expired");
}