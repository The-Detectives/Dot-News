// handling upload image
module.exports = async (req, res, next) => {
  const file = req.files[0];
  if (!file) {
    res.json({
      error: {
        uploaded: false,
        message:
          'The image upload failed.',
      },
    });
  }
  res.json({
    uploaded: true,
    url: file.path.slice(10),
  });
};
