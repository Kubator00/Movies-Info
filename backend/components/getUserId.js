const User = require("../database/models/UserModel");

module.exports = async (email) => {
    let user = await User.findOne({email: email});
    if(!user)
        throw new Error('User not found');
    return user?._id.toString();
}

