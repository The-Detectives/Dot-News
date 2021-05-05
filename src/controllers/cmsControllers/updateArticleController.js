const { updateArticleDetails } = require('../../models/articleModel');
const { saveUploadFile } = require('../../models/fileModel');

// handling update article
module.exports = async (req, res, next) => {
  let articleData = req.body;
  const file = req.file;

  try {
    if(file){
      const url = file.path.slice(10);
      let fileId = await saveUploadFile(url);
      fileId = fileId[0].id;
      articleData.cover_image_id = fileId;
    }
    await updateArticleDetails(articleData);

    req.flash('info', 'Article updated successfully');
    res.redirect('/admin/dashboard');
  } catch (e) {
    next(e);
  }
};
