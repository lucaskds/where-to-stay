/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const indexRoutes = require('./api/routes/index');
const bookingsRoutes = require('./api/routes/bookings');
const hotelsRoutes = require('./api/routes/hotels');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/hotels', hotelsRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
