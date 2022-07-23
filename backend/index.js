const express = require('express');
const cors = require('cors');
const databaseConnect = require('./database/connection');
const {graphqlHTTP} = require("express-graphql");
const {RootSchema} = require('./graphQl/index');

const app = express();
const PORT = 3010;

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

app.listen(PORT, () => {
    console.log(`Film-Info Server`)
    console.log(`Server is listening on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('<h1>Film-Info Server</h1>')
});

app.use(
    '/graphql',
    graphqlHTTP({
        schema: RootSchema,
        graphiql: true
    })
);

module.exports.mongoDb = databaseConnect();



