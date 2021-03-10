const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const User = require('../models/User');
const { findByIdAndUpdate, findByIdAndDelete } = require('../models/Review');

/**
 * @description     get reviews
 * @route           GET /api/v1/reviews
 *                  GET /api/v1/bootcamps/:bootcampId/reviews
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @description     get single review
 * @route           GET /api/v1/reviews/:id
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: review });
});

/**
 * @description     add a review
 * @route           POST /api/v1/bootcamps/:id/reviews/
 * @access          Private/user
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with id: ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

/**
 * @description     update a review
 * @route           PUT /api/v1/reviews/:id
 * @access          Private/user
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id: ${req.params.id}`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    console.log(review.user.toString());
    console.log(req.user.id);
    console.log(req.user.role);
    return next(
      new ErrorResponse(
        `Not authorized to update review with id: ${req.params.id}`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

/**
 * @description     Delete a review
 * @route           Delete /api/v1/reviews/:id
 * @access          Private/user
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review found with id: ${req.params.id}`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `Not authorized to delete review with id: ${req.params.id}`,
        401
      )
    );
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
