const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const colors = require('colors');

/**
 * Load the environment vars. These must be loaded
 * befpre the bootcamps routes are loaded in
 */
dotenv.config({ path: './config/config.env' });

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const users = require('./routes/users');
const auth = require('./routes/auth');

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
 * cookie parser
 */
app.use(cookieParser());

/**
 * Add dev logging middleware package morgan
 * which can be utilised for development mode
 * only.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * file uploading middleware
 */
app.use(fileupload());

/**
 * set static folder
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Mounts the routers
 */
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);

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
      .green.inverse.bold
  )
);

/**
 * handler for unhandled promise rejections global catcher.
 * catcher in the ai, ai, ai... ;)
 */
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error::Unhandled Rejection::${err.message}`.red.inverse.bold);
  server.close(() => process.exit(1));
});
