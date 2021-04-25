const { getCategories } = require('../../models/categoryModel');

// handling the about us page
module.exports = function aboutusPageController(req, res, next) {
  getCategories()
    .then((categories) => {
      res.render('pages/aboutUs', { categories: categories });
    })
    .catch((e) => next(e));
};
