const {GraphQLObjectType, GraphQLString, GraphQLList} = require("graphql");
const ProductionType = require("../Productions/ProductionType");
const Production = require("../../database/models/ProductionModel");


module.exports = new GraphQLObjectType({
    name: 'UpcomingPremiers',
    fields: () => ({
        _id: {type: GraphQLString},
        productionId: {type: GraphQLString},
        production:{
            type: new GraphQLList(ProductionType),
            resolve: (parent,args,context) => {
                return [Production.findById(parent.productionId)];
            }
        }
    })
});
