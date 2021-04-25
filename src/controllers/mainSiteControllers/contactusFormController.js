const { dbExcecute } = require('../../helpers/pgClient');

// Handling contact form
module.exports = function contactHandler(req, res, next) {
  let contactData = req.body;
  let sqlContact =
    'INSERT INTO contact (name, phone, email, message, date) VALUES ($1, $2, $3, $4, $5);';
  let safeValues1 = [
    contactData.username,
    contactData.phone,
    contactData.email,
    contactData.message,
    new Date(),
  ];
  dbExcecute(sqlContact, safeValues1)
    .then(res.send({ Message: 'Your message has been sent successfully' }))
    .catch((e) => next(e));
};
