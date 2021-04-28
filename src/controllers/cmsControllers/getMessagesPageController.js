const { getCategories } = require('../../models/categoryModel');
const { getContactMessages } = require('../../models/contactModel');

// handling contact message
module.exports = async (req, res, next) => {
  try {
    let messages = await getContactMessages();
    let categories = await getCategories();

    res.render('pages/admin/dashboardmessages', {
      messages: messages,
      categories: categories,
      category_name: 'messages',
    });
  } catch (e) {
    next(e);
  }
};
