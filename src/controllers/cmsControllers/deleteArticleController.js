const { deleteArticle } = require('../../models/articleModel');

// handling delete article
module.exports = function deleteArticleController(req, res, next) {
  let articleId = req.params.id;
  deleteArticle(articleId)
    .then(() => {
      req.flash('info', 'Article Deleted successfully');
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
};
