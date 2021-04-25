const { getDataFromAPI } = require('../../helpers/superAgentClient');
const { getCategories } = require('../../models/categoryModel');
const { getArticles } = require('../../models/articleModel');
const { Article } = require('../../store');

// handling the category Page
module.exports = function categoryPageController(req, res, next) {
  let categoryName = req.params.category;
  if (categoryName === 'admin') {
    res.redirect('/admin/login');
  }

  let category_API_KEY = process.env.CATEGORY_KEY;
  let categoryUrl = `https://api.nytimes.com/svc/topstories/v2/${categoryName}.json?api-key=${category_API_KEY}`;

  getDataFromAPI(categoryUrl)
    .then((categoryData) => {
      let arr = categoryData.results.map((val) => {
        return new Article({ ...val, section: categoryData.section });
      });

      getCategories()
        .then((categories) => {
          let categoriesNames = categories.reduce((catNames, catObj) => {
            catNames.push(catObj.name);
            return catNames;
          }, []);

          if (!categoriesNames.includes(categoryName)) {
            throw new Error('Page Not Found');
          }

          getArticles(categoryName)
            .then((data) => {
              let resultDb = data;

              res.render('pages/category', {
                categoryApi: arr,
                categoryDB: resultDb,
                categories: categories,
              });
            })
            .catch((e) => next(e));
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};
