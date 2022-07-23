const {GraphQLObjectType, GraphQLString, GraphQLList} = require("graphql");
const ProductionType = require("../Production/ProductionType");
const Production = require("../../database/models/MovieModel");


module.exports = new GraphQLObjectType({
    name: 'UpcomingPremiers',
    fields: () => ({
        _id: {type: GraphQLString},
        movieId: {type: GraphQLString},
        production:{
            type: new GraphQLList(ProductionType),
            resolve: (parent,args,context) => {
                return [Production.findById(parent.movieId)];
            }
        }
    })
});