const { dbExcecute } = require('../../helpers/pgClient');

// handling the about us page
module.exports = function aboutusPageController(req, res, next) {
  let categorySql = 'SELECT * FROM category;';
  dbExcecute(categorySql).then((categories) => {
    res.render('pages/aboutUs', { categories: categories });
  });
};
