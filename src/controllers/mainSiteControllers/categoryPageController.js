const { getDataFromAPI } = require('../../helpers/superAgentClient');
const { getCategories } = require('../../models/categoryModel');
const { getArticles } = require('../../models/articleModel');
const { Article } = require('../../store');

// handling the category Page
module.exports = async (req, res, next) => {
  let categoryName = req.params.category;
  if (categoryName === 'admin') {
    res.redirect('/admin/login');
    return;
  }

  let category_API_KEY = process.env.CATEGORY_KEY;
  let categoryUrl = `https://api.nytimes.com/svc/topstories/v2/${categoryName}.json?api-key=${category_API_KEY}`;

  try {
    let categoryData = await getDataFromAPI(categoryUrl);
    let arr = categoryData.results.map((val) => {
      return new Article({ ...val, section: categoryData.section });
    });

    let categories = await getCategories();
    let categoriesNames = categories.reduce((catNames, catObj) => {
      catNames.push(catObj.name);
      return catNames;
    }, []);
    if (!categoriesNames.includes(categoryName)) {
      throw new Error('Page Not Found');
    }

    let categoryArticles = await getArticles(categoryName);
    let resultDb = categoryArticles;

    res.render('pages/category', {
      categoryApi: arr,
      categoryDB: resultDb,
      categories: categories,
    });
  } catch (e) {
    next(e);
  }
};
