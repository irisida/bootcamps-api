/**
 * @description     Get all bootcamps
 * @route           GET /api/v1/bootcamps
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Gets all bootcamps data' });
};

/**
 * @description     Get one bootcamp
 * @route           GET /api/v1/bootcamps/:id
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Gets a single bootcamp with ID of ${req.params.id}`,
  });
};

/**
 * @description     post a new bootcamp
 * @route           POST /api/v1/bootcamps
 * @access          Private
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Creates a new bootcamp' });
};

/**
 * @description     Update one bootcamp
 * @route           PUT /api/v1/bootcamps/:id
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Updates a single bootcamp with ID of ${req.params.id}`,
  });
};

/**
 * @description     Delete one bootcamp
 * @route           DELETE /api/v1/bootcamps/:id
 * @access          Public
 * @param {*} req   request
 * @param {*} res   response
 * @param {*} next  next functions
 */
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Deletes a single bootcamp with ID of ${req.params.id}`,
  });
};
