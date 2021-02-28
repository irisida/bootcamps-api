const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');

/**
 * Load the environment vars
 */
dotenv.config({ path: './config/config.env' });

/**
 * Connect to the application database
 */
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Add dev logging middleware package morgan
 * which can be utilised for developmeht mode
 * only.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Mounts the routers
 */
app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(
  PORT,
  console.log(
    `SUCCESS::Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`
      .yellow.bold
  )
);

/**
 * handler for unhandled promise rejections global catcher.
 * catcher in the ai, ai, ai... ;)
 */
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error::Unhandled rejection::${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
