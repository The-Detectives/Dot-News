const { dbExcecute } = require('../../helpers/pgClient');

module.exports = function contactuspageController(req, res, next) {
  let categorySql = 'SELECT * FROM category;';
  dbExcecute(categorySql).then((categories) => {
    res.render('pages/contactUs', { categories: categories });
  });
};
