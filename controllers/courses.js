const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const { json } = require('express');

/**
 * @description     Get all courses
 * @route           GET /api/v1/courses
 * @route           GET /api/v1/bootcamps/:bootcampId/courses
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/**
 * @description     Get a course details
 * @route           GET /api/v1/courses/:id
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(new ErrorResponse(`No course with id: ${req.params.id}`), 404);
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @description     POST a new course with details
 * @route           POST /api/v1/bootcamps/:id/courses
 * @access          Private
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id: ${req.params.bootcampId}`),
      404
    );
  }

  // check ownership
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to add a course to the ${bootcamp.name} bootcamp`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @description     PUT  upated course details
 * @route           PUT /api/v1/courses/:id
 * @access          Private
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`No course with id: ${req.params.id}`), 404);
  }

  // check ownership
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to add a course to the ${course.name} bootcamp`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @description     DELETE a course with details
 * @route           PUT /api/v1/courses/:id
 * @access          Private
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`No course with id: ${req.params.id}`), 404);
  }

  // check ownership
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to add a course to the ${course.name} bootcamp`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
