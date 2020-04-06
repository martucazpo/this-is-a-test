if (process.env.NODE_ENV !== 'production'){
require('dotenv').config();
}

const express = require('express');
const app = express();
const routes = require('./routes');
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL;
const db = mongoose.connection;

mongoose.connect( DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('The mongoose is on the loose'));

app.use(express.json());
app.use('/testApp', routes);

app.listen(PORT, () => {
    console.log('The server is always listening on Port ' + PORT);
});