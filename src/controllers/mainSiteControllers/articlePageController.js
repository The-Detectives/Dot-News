const { getDataFromAPI } = require('../../helpers/superAgentClient');
const { getCategories } = require('../../models/categoryModel');
const { getArticleDetails } = require('../../models/articleModel');
const { Article } = require('../../store');

// handling the article page
module.exports = async (req, res, next) => {
  try {
    let result = await getArticleDetails(req.params.id);
    let article = result[0];
    let category = article.name;
    let CATEGORY_KEY = process.env.CATEGORY_KEY;
    let categoryUrl = `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${CATEGORY_KEY}`;
    let categoryData = await getDataFromAPI(categoryUrl);
    let categoryArticles = categoryData.results.slice(0, 6).map((val) => {
      return new Article({ ...val, section: categoryData.section });
    });
    let categories = await getCategories();
    res.render('pages/article', {
      articleData: article,
      articleCategory: categoryArticles,
      categories: categories,
    });
  } catch (e) {
    next(e);
  }
};
