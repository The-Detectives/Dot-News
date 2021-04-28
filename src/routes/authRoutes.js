const { cmsControllers } = require('../controllers');

module.exports = (router) => {
  router.get('/admin/login', cmsControllers.getLoginPageController);
  router.post('/admin/login', cmsControllers.loginFormController);
  router.get('/admin/logout', cmsControllers.logoutController);
};
