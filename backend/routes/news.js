const express = require('express');
const router = express.Router();
const News = require('../database/models/NewsModel');
const mongoose = require('mongoose')

router.get('/last', async (req, res) => {
    let result;
    try {
        result = await News.find({}, null, {limit: 20});
    } catch (err) {
        return res.status(500).send('Error occured');
    }
    if (!result || result.length < 1)
        return res.status(404).send('Not found');
    res.send(result)
});

router.get('/content', async (req, res) => {
    let result;
    if (!req.query?.id)
        return res.status(404).send('Not found');
    try {
        result = await News.findOne({_id: new mongoose.Types.ObjectId(req.query.id)});
    } catch (err) {
        return res.status(500).send('Error occured');
    }
    if (!result || result.length < 1)
        return res.status(404).send('Not found');
    res.send(result)
});


module.exports = router;