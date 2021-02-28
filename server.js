const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');

/**
 * Load the environment vars
 */
dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Mount the routers
 */
app.use('/api/v1/bootcamps', bootcamps);

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`)
);
