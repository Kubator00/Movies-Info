const {GraphQLList, GraphQLString} = require("graphql");
const UserType = require("./UserType")
const User = require("../../database/models/UserModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = require("../../const/PRIVATE_KEY");
const registrationSchema = require("../../validationSchemas/user/registrationSchema");
const getUserId = require("../../components/getUserId");
const userAuthorization = require("../../components/userAuthorization");

module.exports.Login = {
    name: 'Login user',
    description: 'Return user info and verify token',
    type: new GraphQLList(UserType),
    args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString}
    },
    async resolve(parent, args, context, info) {
        const {email, password} = args;
        const user = (await User.findOne({email: email}));
        if (!user || !await bcrypt.compare(password, user.password))
            throw new Error('Incorrect email or password');

        const token = jwt.sign({id: user._id}, PRIVATE_KEY);
        return [{email: user.email, login: user.login, token: token, isAdmin: user.isAdmin}];
    }
}

module.exports.Register = {
    name: 'Register user',
    description: 'Create new user',
    type: GraphQLString,
    args: {
        email: {type: GraphQLString},
        login: {type: GraphQLString},
        password: {type: GraphQLString}
    },
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

module.exports.changePassword = {
    name: 'Change password',
    description: 'Change user password',
    type: GraphQLString,
    args: {
        token: {type: GraphQLString},
        email: {type: GraphQLString},
        newPassword: {type: GraphQLString},
        password: {type: GraphQLString},
    },
    async resolve(parent, args, context, info) {
        const {newPassword, email, token, password} = args;
        const schemaValidate = registrationSchema.validate(
            {password: newPassword, email: email, login: 'test'}
        );
        if (schemaValidate.error)
            throw new Error(schemaValidate.error?.message);

        try {
            const userId = await getUserId(email);
            await userAuthorization(userId, token);
        } catch (err) {
            throw err;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        let user;
        try {
            user = await User.findOne({email: email});
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

module.exports.changeEmail = {
    name: 'Change email',
    description: 'Change user email',
    type: GraphQLString,
    args: {
        token: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        newEmail: {type: GraphQLString},
    },
    async resolve(parent, args, context, info) {
        console.log(args)
        const {newEmail, email, token, password} = args;
        const schemaValidate = registrationSchema.validate(
            {password: password, email: newEmail, login: 'test'}
        );
        if (schemaValidate.error)
            throw new Error(schemaValidate.error?.message);

        try {
            const userId = await getUserId(email);
            await userAuthorization(userId, token);
        } catch (err) {
            throw err;
        }


        let user;
        try {
            user = await User.findOne({email: email});
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
