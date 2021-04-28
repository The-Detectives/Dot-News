const { getCategories } = require('../../models/categoryModel');
const { getArticleDetails } = require('../../models/articleModel');

// handling showing article in edit page
module.exports = async (req, res, next) => {
  let id = req.params.id;
  try {
    let articleData = await getArticleDetails(id);
    let article = articleData[0];

    let categories = await getCategories();

    res.render('pages/admin/article', {
      categories: categories,
      article: article,
    });
  } catch (e) {
    next(e);
  }
};
