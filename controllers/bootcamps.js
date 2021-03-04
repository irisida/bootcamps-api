const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
const { json } = require('express');

/**
 * @description     Get all bootcamps
 * @route           GET /api/v1/bootcamps
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const reqQuery = { ...req.query };

  /**
   * to implement the ability to handle selects and sorts in the
   * params of our query we must frst define the words we need
   * to remove.
   *
   */
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // handle parameterised searches.
  let queryStr = JSON.stringify(reqQuery);

  // handle the query string and replace the switches
  // with a required $ character for mongoose.
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // find resource
  let query = Bootcamp.find(JSON.parse(queryStr));

  /**
   * Add the select fields back in to the rebuilt query
   * and then execute the query.
   */
  if (req.query.select) {
    fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  /**
   * url parameter specified sort handling
   */
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  /**
   * pagination handling.
   * defines the page number, the limit per page is defaulted to
   * 100 and we also define the skip.
   */
  console.log('req.query.page:', req.query.page);
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination: pagination,
    data: bootcamps,
  });
});

/**
 * @description     Get one bootcamp
 * @route           GET /api/v1/bootcamps/:id
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @description     post a new bootcamp
 * @route           POST /api/v1/bootcamps
 * @access          Private
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

/**
 * @description     Update one bootcamp
 * @route           PUT /api/v1/bootcamps/:id
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @description     Delete one bootcamp
 * @route           DELETE /api/v1/bootcamps/:id
 * @access          Private
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with ID of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});

/**
 * @description     GET bootcamps within a certain radius
 * @route           GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const EARTH_RADIUS_MILES = 3963;
  const EARTH_RADIUS_KM = 6378;

  // get lat & lon from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius in radians
  // dividide distance by the radius of the earth, 3,963mi / 6378km
  const radius = distance / EARTH_RADIUS_MILES;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
