const { addNewArticle } = require('../../models/articleModel');

// handling creating new article
module.exports = function addNewArticleController(req, res, next) {
  let articleData = req.body;

  addNewArticle(articleData)
    .then(() => {
      req.flash('info', 'Article Added successfully');
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
};
