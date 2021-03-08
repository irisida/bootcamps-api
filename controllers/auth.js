const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

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

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

/**
 * General helper function to:
 * Get token from model and create a cookie.
 * Sends response as a cookie
 */
const sendTokenResponse = (user, statusCode, res) => {
  /**
   * user and password checks have passed if you reach here so we can
   * now create and return a token.
   */
  const token = user.getSignedJwtToken();

  const options = {
    // calculates the 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  /**
   * adds https for production envs
   */
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token: token,
  });
};

/**
 * @description     Get current logged in user
 * @route           POST /api/v1/auth/me
 * @access          Private
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @description     Forgot password
 * @route           POST /api/v1/auth/forgotpassword
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse(`email not found`, 404));
  }

  // get reset token
  const resetToken = user.getResetPasswordToken();

  // save the resetToken vlaues
  await user.save({ validateBeforeSave: false });

  // create the reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message: message,
    });

    res.status(200).json({
      success: true,
      data: 'Email sent',
    });
  } catch (error) {
    /**
     * log the error
     */
    console.error(error);

    /**
     * clean the reset fields on the user record
     * stored in the database.
     */
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});
