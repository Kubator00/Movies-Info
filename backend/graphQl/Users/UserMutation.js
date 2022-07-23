const {GraphQLList, GraphQLString} = require("graphql");
const UserType = require("./UserType")
const User = require("../../database/models/UserModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = require("../../const/PRIVATE_KEY");
const registrationSchema = require("../../validationSchemas/user/registrationSchema");

module.exports.Login = {
    name:'Login user',
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

        const token = jwt.sign({id: user._id}, PRIVATE_KEY, {expiresIn: 50000});
        return [{email: user.email, login: user.login, token: token, isAdmin: user.isAdmin}];
    }
}

module.exports.Register = {
    name:'Register user',
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
            login:login,
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

