const { getCategories } = require('../models/categoryModel');

module.exports = function notFoundPageHandler(req, res, next) {
  getCategories()
    .then((categories) => {
      res.status(401).render('pages/error', { categories: categories });
    })
    .catch((e) => next(e));
};
