const { dbExcecute } = require('../helpers/pgClient');

module.exports = function notFoundPageHandler(req, res, next) {
  let categorySql = 'SELECT * FROM category;';
  dbExcecute(categorySql)
    .then((categories) => {
      res.status(401).render('pages/error', { categories: categories });
    })
    .catch((e) => next(e));
};
