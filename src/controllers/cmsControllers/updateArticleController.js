const { updateArticleDetails } = require('../../models/articleModel');

// handling update article
module.exports = function updateArticleController(req, res, next) {
  let articleData = req.body;

  updateArticleDetails(articleData)
    .then(() => {
      req.flash('info', 'Article updated successfully');
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
};
