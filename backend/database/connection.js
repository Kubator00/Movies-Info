const mongoose = require("mongoose");

const mongoDBUrl = 'mongodb://127.0.0.1:27017/film-info';

module.exports = async () => {
    try {
        await mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true});
        return mongoose;
    } catch (err) {
        console.error(err);
    }
}