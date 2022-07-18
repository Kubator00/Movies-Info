const Movie = require("../database/models/MovieModel");
module.exports = async (req, res, categoryName) => {
    let {orderBy = 'rating', descending: sort = 'true'} = req.query;
    sort = sort === 'true' ? '-1' : '1';
    orderBy = orderBy === 'rating' ? {'rating.rate': sort} : orderBy === 'release date' ? {'releaseDate': sort} : {'rating.numberOfRates': sort};
    const result = [];

    const numberOfRows = await Movie
        .count({category: categoryName});
    const movies = await Movie
        .find({category: categoryName})
        .skip(req.query.page && req.query.pageSize ? parseInt(req.query.page - 1) * parseInt(req.query.pageSize) : 0)
        .limit(req.query.pageSize ? req.query.pageSize : 500)
        .sort(orderBy);

    for (let movie of movies) {
        result.push({
            name: movie.name,
            releaseDate: movie.releaseDate,
            directoryName: movie.directoryName,
            id: movie._id,
            rating: movie.rating,
            category: movie.category
        })
    }
    res.send({data: result, numberOfRows: numberOfRows});
}