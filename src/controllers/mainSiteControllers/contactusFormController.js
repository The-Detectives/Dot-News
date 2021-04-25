const { saveContactMessage } = require('../../models/contactModel');

// Handling contact form
module.exports = function contactusFormController(req, res, next) {
  let contactData = req.body;
  saveContactMessage(contactData)
    .then(res.send({ Message: 'Your message has been sent successfully' }))
    .catch((e) => next(e));
};
