const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const User = require('../models/User');

/**
 * @description     get all users
 * @route           GET /api/v1/auth/users
 * @access          Private/admin
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @description     get a single user
 * @route           GET /api/v1/auth/users
 * @access          Private/admin
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @description     Create a user
 * @route           POST /api/v1/auth/users
 * @access          Private/admin
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @description     Update a user
 * @route           PUT /api/v1/auth/users/:id
 * @access          Private/admin
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @description     Update a user
 * @route           DELETE /api/v1/auth/users/:id
 * @access          Private/admin
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
