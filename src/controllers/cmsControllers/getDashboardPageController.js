const { getCategories } = require('../../models/categoryModel');
const { dbExcecute } = require('../../helpers/pgClient');

// handling the admin dashboard page
module.exports = function getDashboardPageController(req, res, next) {
  let category_name = req.query.category ? req.query.category : '';
  let pageNumber = req.query.page ? parseInt(req.query.page) : 1;
  let limit = 5;
  let startWith = (pageNumber - 1) * limit;

  let sqlQuery = 'SELECT * FROM article ORDER BY id DESC LIMIT $1 OFFSET $2;';
  let safeValues = [limit, startWith];
  if (req.query.category) {
    sqlQuery =
      'SELECT * FROM category JOIN article ON article.category_id = category.id WHERE name = $1 ORDER BY article.id DESC LIMIT $2 OFFSET $3;';
    safeValues = [category_name, limit, startWith];
  }

  dbExcecute(sqlQuery, safeValues)
    .then((articles) => {
      getCategories()
        .then((categories) => {
          let sqlCountAllQuery = 'SELECT COUNT(*) FROM article;';
          safeValues = [];
          if (category_name) {
            sqlCountAllQuery =
              'SELECT COUNT(*) FROM category JOIN article ON article.category_id = category.id WHERE name = $1;';
            safeValues = [category_name];
          }

          dbExcecute(sqlCountAllQuery, safeValues)
            .then((countData) => {
              let hasNext = parseInt(countData[0].count) > startWith + limit;
              res.render('pages/admin/dashboard', {
                articles: articles,
                categories: categories,
                pageNumber: pageNumber,
                category_name: category_name,
                hasNext: hasNext,
              });
            })
            .catch((e) => next(e));
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};
