const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const User = require('../models/User');

/**
 * @description     Register user
 * @route           POST /api/v1/auth/register
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  /**
   * create a token by calling the method that is created on the User model
   * to generate and return a JWT token with the expiry set to a default of
   * 30 days.
   */
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token,
  });
});

/**
 * @description     Login user
 * @route           POST /api/v1/auth/login
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  /**
   * Validate email and password
   */
  if (!email || !password) {
    return next(new ErrorResponse('Invalid credentials', 400));
  }

  /**
   * find the user in the database where the email provided matches
   * a user in the db.
   * in the model for the password field we have select set to false
   * this means we have to add it explicitly here in the return
   * with the select(+password) directive.
   */
  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  /**
   * check password matched
   */
  const isMatched = await user.matchPassword(password);
  if (!isMatched) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  /**
   * user and password checks have passed if you reach here so we can
   * now create and return a token.
   */
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token,
  });
});
