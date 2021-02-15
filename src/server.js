/* eslint-disable no-console */
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.DATABASE_CONNECTION_STRING || 'mongodb://localhost:27017';

mongoose
    .connect(MONGO_URL, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('DB Connected');
    })
    .catch((error) => {
        console.log(error);
    });
app.listen(PORT);

console.log('App listening on port: ', PORT);
