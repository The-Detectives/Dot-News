const { dbExcecute } = require('../helpers/pgClient');

function getCategories() {
  let categorySql = 'SELECT * FROM category;';
  return dbExcecute(categorySql).then((categories) => categories);
}

module.exports = {
  getCategories,
};
