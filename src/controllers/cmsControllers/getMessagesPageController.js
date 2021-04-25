const { getCategories } = require('../../models/categoryModel');
const { getContactMessages } = require('../../models/contactModel');

// handling contact message
module.exports = function getMessagesPageController(req, res, next) {
  getContactMessages()
    .then((messages) => {
      getCategories()
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
