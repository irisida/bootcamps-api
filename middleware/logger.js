/**
 * @description     Custom simple logging middleware. Suitable for development
 *                  only, but not as defind as published package Morgan.
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next function
 */
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} `
  );
  next();
};

module.exports = logger;
