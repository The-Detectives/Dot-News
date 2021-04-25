//Get Controllers
const { cmsControllers } = require('../controllers');
const { isAuthenticated } = require('../middleWares');

module.exports = (router) => {
  router.get('/admin/dashboard', isAuthenticated, cmsControllers.getDashboardPageController);
  router.get('/admin/article/new', isAuthenticated, cmsControllers.getAddNewArticlePageController);
  router.post('/admin/article/new', isAuthenticated, cmsControllers.addNewArticleController);
  router.delete('/admin/article/:id', isAuthenticated, cmsControllers.deleteArticleController);
  router.get('/admin/article/:id', isAuthenticated, cmsControllers.getArticlePageController);
  router.put('/admin/article/:id', isAuthenticated, cmsControllers.updateArticleController);
  router.get('/admin/messages', isAuthenticated, cmsControllers.getMessagesPageController)
};
