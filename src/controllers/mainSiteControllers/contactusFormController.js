const { saveContactMessage } = require('../../models/contactModel');

// Handling contact form
module.exports = async (req, res, next) => {
  let contactData = req.body;
  try {
    await saveContactMessage(contactData);
    res.send({ Message: 'Your message has been sent successfully' })
  }
  catch(e) {
    next(e);
  };
};
