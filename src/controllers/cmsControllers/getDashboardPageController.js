const { getCategories } = require('../../models/categoryModel');
const { getArticles, countArticles } = require('../../models/articleModel');

// handling the admin dashboard page
module.exports = async (req, res, next) => {
  let category_name = req.query.category ? req.query.category : '';
  let pageNumber = req.query.page ? parseInt(req.query.page) : 1;
  let limit = 5;
  let startWith = (pageNumber - 1) * limit;

  try {
    let articles = await getArticles(category_name, limit, startWith);
    let categories = await getCategories();
    let countData = await countArticles(category_name);

    let hasNext = parseInt(countData[0].count) > startWith + limit;

    res.render('pages/admin/dashboard', {
      articles: articles,
      categories: categories,
      pageNumber: pageNumber,
      category_name: category_name,
      hasNext: hasNext,
    });
  } catch (e) {
    next(e);
  }
};
