module.exports.paginationMiddlware = async (req, res, next, model) => {
  const { userId } = req.tokenData;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  //   results.results = model.slice(startIndex, endIndex);

  // if (endIndex < (await model.length)) {
  //   results.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }
  // if (startIndex > 0) {
  //   results.previous = {
  //     page: page - 1,
  //     limit,
  //   };
  // }
  try {
    results.results = await model.findAll({
      raw: true,
      where: { userId },
      limit: limit,
      offset: startIndex,
      attributes: { exclude: ['updatedAt'] },
    });
    if (!results.results) {
      return res.status(404).send('No results');
    }
    res.paginatedResults = results;
    next();
  } catch (err) {
    next(err);
  }
};
