const { dbExcecute } = require('../../helpers/pgClient');

// handling showing article in edit page
module.exports = function getDashboardPageController(req, res, next) {
  let id = req.params.id;
  let sqlQuery = 'SELECT * From article WHERE id = $1';

  dbExcecute(sqlQuery, [id])
    .then((data) => {
      let = article = data[0];
      let categorySqlQuery = 'SELECT * FROM category;';

      dbExcecute(categorySqlQuery)
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
