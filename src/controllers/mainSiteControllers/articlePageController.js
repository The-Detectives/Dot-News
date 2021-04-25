const { getDataFromAPI } = require('../../helpers/superAgentClient');
const { getCategories } = require('../../models/categoryModel');
const { getArticleDetails } = require('../../models/articleModel');
const { Article } = require('../../store');

// handling the article page
module.exports = function articlePageController(req, res, next) {
  getArticleDetails(req.params.id)
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
          getCategories()
            .then((categories) => {
              res.render('pages/article', {
                articleData: article,
                articleCategory: arr,
                categories: categories,
              });
            })
            .catch((e) => next(e));
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};
