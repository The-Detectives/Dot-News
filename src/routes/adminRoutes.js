//Get Controllers
const { cmsControllers } = require('../controllers');
const { isAuthenticated } = require('../middleWares');
const { upload } = require('../middleWares');

module.exports = (router) => {
  router.get('/admin/dashboard', isAuthenticated, cmsControllers.getDashboardPageController);
  router.get('/admin/article/new', isAuthenticated, cmsControllers.getAddNewArticlePageController);
  router.post('/admin/article/new', isAuthenticated, upload.single('image') , cmsControllers.addNewArticleController);
  router.delete('/admin/article/:id', isAuthenticated, cmsControllers.deleteArticleController);
  router.get('/admin/article/:id', isAuthenticated, cmsControllers.getArticlePageController);
  router.put('/admin/article/:id', isAuthenticated, upload.single('image'), cmsControllers.updateArticleController);
  router.get('/admin/messages', isAuthenticated, cmsControllers.getMessagesPageController);
  router.post('/upload-image', isAuthenticated, upload.any(), cmsControllers.uploadImageController);
};
