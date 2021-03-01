const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
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
 * body parser
 */
app.use(express.json());

/**
 * Add dev logging middleware package morgan
 * which can be utilised for development mode
 * only.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Mounts the routers
 */
app.use('/api/v1/bootcamps', bootcamps);

/**
 * use the custom errorHandler. Note to not add the 'use' statement
 * for the custom handlers at the top otherwise it will not perform
 * use/call correctly.
 */
app.use(errorHandler);

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
