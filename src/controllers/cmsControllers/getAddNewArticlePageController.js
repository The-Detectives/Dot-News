const { getCategories } = require('../../models/categoryModel');

// handling the add new article page
module.exports = function getAddNewArticlePageController(req, res, next) {
  getCategories()
    .then((categories) => {
      res.render('pages/admin/article', {
        categories: categories,
        article: {},
      });
    })
    .catch((e) => next(e));
};
