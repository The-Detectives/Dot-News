const { dbExcecute } = require('../../helpers/pgClient');

// handling the add new article page
module.exports = function getAddNewArticlePageController(req, res, next) {
  let categorySqlQuery = 'SELECT * FROM category';

  dbExcecute(categorySqlQuery)
    .then((categories) => {
      res.render('pages/admin/article', {
        categories: categories,
        article: {},
      });
    })
    .catch((e) => next(e));
};
