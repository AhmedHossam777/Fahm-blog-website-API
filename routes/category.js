const express = require('express');
const isLogin = require('../middlewares/isLogin');
const isSuspend = require('../middlewares/isSuspended');

const {
  getCategories,
  getCategory,
  createCategory,
} = require('../controllers/category');

const router = express.Router();

router
  .route('/')
  .get(isLogin, isSuspend, getCategories)
  .post(isLogin, isSuspend, createCategory);

router.route('/:id').get(isLogin, isSuspend,getCategory);

module.exports = router;
