const express = require('express');
const isLogin = require('../middlewares/isLogin');
const isSuspend = require('../middlewares/isSuspended');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category');

const router = express.Router();

router
  .route('/')
  .get(isLogin, isSuspend, getCategories)
  .post(isLogin, isSuspend, createCategory);

router
  .route('/:id')
  .get(isLogin, isSuspend, getCategory)
  .patch(isLogin, isSuspend, updateCategory)
  .delete(isLogin, isSuspend, deleteCategory);

module.exports = router;
