const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const getUserId = require('../../components/getUserId');
const MovieRating = require('../../database/models/MovieRating');
const UpcomingPremiere = require('../../database/models/UpcomingPremiereModel');
const MovieBanners = require('../../database/models/MoviesBannersModel');
const Movie = require('../../database/models/MovieModel');
const getRandomInt = require('../../components/getRandomInt');


router.get('/banners', async (req, res) => {
    const result = await MovieBanners
        .find({})
        .limit(20);
    res.send(result);
});


router.get('/upcomingpremieres', async (req, res) => {
    const moviesId = await UpcomingPremiere.find();
    let result = [];
    for (let id of moviesId) {
        const movie = await Movie.findOne({_id: new mongoose.Types.ObjectId(id.movieId)});
        if (!movie)
            continue;
        result.push({name: movie.name, directoryName: movie.directoryName})
    }
    res.send(result);
});

router.get('/details', async (req, res) => {
    if (!req.query?.movieName)
        return res.status(404).send('Not found');
    const instance = await Movie.findOne({name: {$regex: req.query.movieName, $options: 'i'}});
    if (!instance || instance.length < 1)
        return res.status(404).send('Not found');
    res.send(instance);
});


router.get('/recommended', async (req, res) => {
    const {limit = 4} = req.query;
    let instance = await Movie.findById(req.query.productionId);
    let result = [];
    if (!instance?.seeAlso || instance.seeAlso.length < 1) {
        let productionsNumber = await Movie.count({});
        let randomNumbers = [];
        for (let i = 0; i < parseInt(limit); i++) {
            let number = getRandomInt(0, productionsNumber);
            randomNumbers.filter(element => element === number).length < 1 ? randomNumbers.push(number) : i -= 1;
        }
        for (let rand of randomNumbers) {
            const production = await Movie.findOne().skip(rand).limit(1).select("name directoryName category");
            result.push(production);
        }
        return res.send(result);
    }

    for await(const production of instance.seeAlso) {
        const a = await Movie.findById(production.productionId).select("name directoryName category");
        result.push(a);
    }
    res.send(result);
});

router.get('/search', async (req, res) => {
    const {keyword} = req.query;
    let instance = await Movie.find({name: {$regex: keyword, $options: "i"}}).select("name directoryName category");
    res.send(instance);
});

const ProductionsList = require('../../components/ProductionsList')
router.get('/list', async (req, res) => {
    await ProductionsList(req, res, req.query.category);
});
const commentRoute = require('./comment');
router.use('/comment', commentRoute);

const ratingRoute = require('./rating');
router.use('/rating', ratingRoute);

module.exports = router;