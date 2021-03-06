const advancedResults = (model, populate) => async (req, res, next) => {
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
  let query = model.find(JSON.parse(queryStr));

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
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  /**
   * check for existence of populate, if found then add the populate
   * to the query.
   */
  if (populate) {
    query = query.populate(populate);
  }

  const results = await query;

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

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination: pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
