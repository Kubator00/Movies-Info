const User = require("../../database/models/UserModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = require("../../const/PRIVATE_KEY");
const registrationSchema = require("../../validationSchemas/user/registrationSchema");



module.exports.Login = {
    mutation: `login(email: String, password: String): User`,
    async resolve(parent, args, context, info) {
        const {email, password} = args;
        const user = (await User.findOne({email: email}));
        if (!user || !await bcrypt.compare(password, user.password))
            throw new Error('Incorrect email or password');

        const token = jwt.sign({id: user._id}, PRIVATE_KEY);

        return {email: user.email, login: user.login, token: token, isAdmin: user.isAdmin};
    }
}

module.exports.Register = {
    mutation: `register(email: String, login:String, password: String): String`,
    async resolve(parent, args, context, info) {
        const {login, password, email} = args;
        const schemaValidate = registrationSchema.validate(
            {login: login, password: password, email: email}
        );
        if (schemaValidate.error)
            throw new Error(schemaValidate.error?.message);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const emailExist = await User.count({email: email});
        if (emailExist > 0)
            throw new Error('Email is already in use');

        const loginExist = await User.count({login: login});
        if (loginExist > 0)
            throw new Error('Login is already in use');

        let user = new User({
            email: email,
            login: login,
            password: hashedPassword,
            registerData: new Date().toISOString(),
            isAdmin: false
        });
        try {
            await user.save();
        } catch (err) {
            throw new Error('Register error');
        }
        return 'Register successful'
    }
}

module.exports.ChangePassword = {
    mutation: `changePassword(userEmail: String, password: String, newPassword: String, userToken:String):String`,
    async resolve(parent, args, context, info) {
        const {newPassword,  userEmail, password} = args;
        const schemaValidate = registrationSchema.validate(
            {password: newPassword, email: userEmail, login: 'test'}
        );
        if (schemaValidate.error)
            throw new Error(schemaValidate.error?.message);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        let user;
        try {
            user = await User.findOne({email: userEmail});
            if (!user)
                throw 'User not found';
        } catch (err) {
            throw new Error('User not found');
        }
        if (!user || !await bcrypt.compare(password, user.password))
            throw new Error('Incorrect password');

        user.password = hashedPassword;
        try {
            await user.save();
        } catch (err) {
            throw new Error('Error occurred');
        }

        return 'Change successful'
    }
}

module.exports.ChangeEmail = {
    mutation: `changeEmail(userEmail: String, password: String, newEmail: String, userToken:String):String`,
    async resolve(parent, args, context, info) {
        const {newEmail, userEmail,  password} = args;
        const schemaValidate = registrationSchema.validate(
            {password: password, email: newEmail, login: 'test'}
        );
        if (schemaValidate.error)
            throw new Error(schemaValidate.error?.message);

        let user;
        try {
            user = await User.findOne({email: userEmail});
            if (!user)
                throw 'User not found';
        } catch (err) {
            throw new Error('User not found');
        }
        if (!user || !await bcrypt.compare(password, user.password))
            throw new Error('Incorrect password');

        user.email = newEmail;
        try {
            await user.save();
        } catch (err) {
            throw new Error('Error occurred');
        }

        return 'Change successful'
    }
}
