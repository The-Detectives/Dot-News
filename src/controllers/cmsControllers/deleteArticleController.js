const { dbExcecute } = require('../../helpers/pgClient');

// handling delete article
module.exports = function deleteArticleController(req, res, next) {
  let articleId = req.params.id;
  let sqlQuery = 'DELETE FROM article WHERE id = $1;';

  dbExcecute(sqlQuery, [articleId])
    .then(() => {
      req.flash('info', 'Article Deleted successfully');
      res.redirect('/admin/dashboard');
    })
    .catch((e) => next(e));
};
