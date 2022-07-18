const express = require('express');
const cors = require('cors');
const databaseConnect = require('./database/connection');

const app = express();
const port = 3010;
app.use(cors());
app.use(express.json());
app.use('/public',express.static('public'));

module.exports.PRIVATE_KEY='test_key_123'


app.listen(port, () => {
    console.log(`Film-Info Server`)
    console.log(`Server is listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.send('<h1>Film-Info Server</h1>')
});

module.exports.mongoDb = databaseConnect();

const productionRoute = require('./routes/production/production');
app.use('/production', productionRoute);
const newsRoute = require('./routes/news');
app.use('/news', newsRoute);
const user = require('./routes/user');
app.use('/user', user);