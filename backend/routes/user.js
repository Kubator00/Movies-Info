const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../database/models/UserModel')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {PRIVATE_KEY} = require("../index");
const loginSchema = require('../validationSchemas/user/loginSchema');
const registrationSchema = require('../validationSchemas/user/registrationSchema');

router.post('/login', async (req, res) => {
    const schemaValidate = loginSchema.validate({email: req.body.email, password: req.body.password});
    if (schemaValidate.error)
        return res.status(400).send(schemaValidate.error?.message);
    const user = await User.findOne({email: req.body.email});
    if (!user || !await bcrypt.compare(req.body.password, user.password))
        return res.status(400).send('Incorrect email or password');

    const token = jwt.sign({id: user._id}, PRIVATE_KEY, {expiresIn: 5});
    res.header('token', token).send({email: user.email, login: user.login, token: token, isAdmin: user.isAdmin});
})

router.post('/register', async (req, res) => {
    const schemaValidate = registrationSchema.validate(
        {login: req.body.login, password: req.body.password, email: req.body.email}
    );

    if (schemaValidate.error)
        return res.status(400).send(schemaValidate.error?.message);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const emailExist = await User.count({email:req.body.email});
    if(emailExist>0)
        return res.status(400).send('Email is already in use');
    const loginExist = await User.count({login:req.body.login});
    if(loginExist>0)
        return res.status(400).send('Login is already in use');

    let user = new User({
        email: req.body.email,
        login: req.body.login,
        password: hashedPassword,
        registerData: new Date().toISOString(),
        isAdmin: false
    });
    try {
         await user.save();
    } catch (err) {
        return res.status(500).send('Register error');
    }
    res.send('Register successful')
})


module.exports = router;