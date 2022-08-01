const express = require('express');
const cors = require('cors');
const databaseConnect = require('./database/connection');
const PORT = require('./const/SERVER_PORT');
const app = express();
const {startGraphQlServer} = require('./graphQl/index');

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

startGraphQlServer();
module.exports.mongoDb = databaseConnect();



