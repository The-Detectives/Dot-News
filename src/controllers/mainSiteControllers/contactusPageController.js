const { getCategories } = require('../../models/categoryModel');

module.exports = function contactuspageController(req, res, next) {
  getCategories()
    .then((categories) => {
      res.render('pages/contactUs', { categories: categories });
    })
    .catch((e) => next(e));
};
