
// handling upload image
module.exports = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a the image')
    return next(error)
  }
  console.log(file)
  res.json(file)
};
