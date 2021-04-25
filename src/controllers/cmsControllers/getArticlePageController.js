const { getCategories } = require('../../models/categoryModel');
const { getArticleDetails } = require('../../models/articleModel');

// handling showing article in edit page
module.exports = function getDashboardPageController(req, res, next) {
  let id = req.params.id;
  getArticleDetails(id)
    .then((data) => {
      let article = data[0];
      getCategories()
        .then((categories) => {
          res.render('pages/admin/article', {
            categories: categories,
            article: article,
          });
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};
