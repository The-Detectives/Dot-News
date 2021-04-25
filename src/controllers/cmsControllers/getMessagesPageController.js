const { dbExcecute } = require('../../helpers/pgClient');

// handling contact message
module.exports = function getMessagesPageController(req, res, next) {
  let contactSql = 'SELECT * FROM contact ORDER BY id DESC;';

  dbExcecute(contactSql)
    .then((messages) => {
      let categorySqlQuery = 'SELECT * FROM category;';
      dbExcecute(categorySqlQuery)
        .then((categories) => {
          res.render('pages/admin/dashboardmessages', {
            messages: messages,
            categories: categories,
            category_name: 'messages',
          });
        })
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
};
