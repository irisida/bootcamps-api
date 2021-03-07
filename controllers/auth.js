const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const User = require('../models/User');

/**
 * @description     Register user
 * @route           GET /api/v1/auth/register
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
