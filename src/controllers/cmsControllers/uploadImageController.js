
// handling upload image
module.exports = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a the image')
    return next(error)
  }
  file.path = file.path.slice(11);
  file.destination = file.destination.slice(11);
  res.json(file)
};
