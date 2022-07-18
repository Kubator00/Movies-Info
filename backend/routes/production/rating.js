const express = require("express");
const router = express.Router();
const userAuthorization = require('../../components/userAuthorization')
const mongoose = require("mongoose");
const MovieRating = require("../../database/models/MovieRating");
const Movie = require("../../database/models/MovieModel");


//need authorization
router.use(userAuthorization)


router.put('/', async (req, res) => {
    const {userId} = req.headers;
    if (!userId)
        return res.status(400).send('Incorrect user account');
    let a, b;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        a = await MovieRating
            .findOne({'userId': userId, 'movieId': req.body.movieId})
        if (a) {
            a.rating = req.body.rating;
        } else {
            a = new MovieRating(
                {
                    movieId: req.body.movieId,
                    userId: userId,
                    rating: req.body.rating,
                }
            )
        }
        await a.save();
        b = await MovieRating.find({'movieId': req.body.movieId});
        const avg = b.reduce((c, d) => c + d.rating, 0) / b.length;
        const c = await Movie.findById(req.body.movieId);
        c.rating.rate = avg;
        c.rating.numberOfRates = b.length;
        await c.save();
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
    } finally {
        session.endSession();
    }


    res.send({rating: a.rating});
})


router.post('/', async (req, res) => {
    const {userId} = req.headers;
    let a = await MovieRating
        .findOne({'userId': userId, 'movieId': req.body.movieId})
    if (!a) return res.send({rating: 0});
    return res.send({rating: a.rating});
})



module.exports = router;