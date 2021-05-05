const { addNewArticle } = require('../../models/articleModel');
const { saveUploadFile } = require('../../models/fileModel');

// handling creating new article
module.exports = async (req, res, next) => {
  let articleData = req.body;
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a the image')
    return next(error)
  }
  const url = file.path.slice(10);

  try {
    let fileId = await saveUploadFile(url);
    fileId = fileId[0].id;
    articleData.cover_image_id = fileId;
    await addNewArticle(articleData);
    req.flash('info', 'Article Added successfully');
    res.redirect('/admin/dashboard');
  } catch (e) {
    next(e);
  }
};
