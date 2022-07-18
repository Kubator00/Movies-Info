const getUserId = require('./getUserId')
const verifyUserToken = require('./verifyToken')


module.exports = async (req, res, next) => {
    try {
        req.headers['userId'] = await getUserId(req.headers['x-email'])
    } catch (err) {
        return res.status(500).send("User not found");
    }

    if (!verifyUserToken(req.headers['x-user-token'], req.headers['userId']))
        return res.status(500).send("User token expired");

    next();
}