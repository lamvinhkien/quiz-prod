const adminController = require('../controllers/AdminController');
const { checkUserLogin } = require('../middleware/jwtAction');
const express = require('express');

const initAdminRoutes = (app) => {
  const router = express.Router();

  router.post('/login', adminController.loginFunc);
  router.post('/logout', checkUserLogin, adminController.logoutFunc);
  router.get('/get', checkUserLogin, adminController.getUserFunc);

  app.use('/api/admin', router);
};

module.exports = initAdminRoutes;