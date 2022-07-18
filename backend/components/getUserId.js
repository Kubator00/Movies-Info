const User = require("../database/models/UserModel");

module.exports = async (email) => {
    let user = await User.findOne({email: email});
    return user?._id.toString();
}

