const categoryController = require('../controllers/CategoryController');
const { checkUserLogin } = require('../middleware/jwtAction');
const express = require('express');

const initCategoryRoutes = (app) => {
  const router = express.Router();

  router.post('/create-category', checkUserLogin, categoryController.CreateCategory);
  router.post('/update-category', checkUserLogin, categoryController.UpdateCategory);
  router.post('/delete-category', checkUserLogin, categoryController.DeleteCategory);
  router.get('/getAll-category', categoryController.GetAllCategory);
  router.get('/getAll-category-pagination', checkUserLogin, categoryController.GetCategoryPagination);

  app.use('/api', router);
};

module.exports = initCategoryRoutes;