const { getDataFromAPI } = require('../../helpers/superAgentClient');
const { dbExcecute } = require('../../helpers/pgClient');

// handling the article page
module.exports = function articlePageController(req, res, next) {
  //article
  let SQL1 = `SELECT * From article JOIN category ON article.category_id = category.id WHERE article.id= $1;`;
  let safeValues1 = [req.params.id];

  dbExcecute(SQL1, safeValues1)
    .then((result) => {
      let article = result[0];
      let category = article.name;
      let CATEGORY_KEY = process.env.CATEGORY_KEY;
      let categoryUrl = `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${CATEGORY_KEY}`;
      getDataFromAPI(categoryUrl)
        .then((categoryData) => {
          let arr = categoryData.results.slice(0, 6).map((val) => {
            return new Article({ ...val, section: categoryData.section });
          });
          let categorySql = 'SELECT * FROM category;';
          dbExcecute(categorySql).then((categories) => {
            res.render('pages/article', {
              articleData: article,
              articleCategory: arr,
              categories: categories,
            });
          });
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};
