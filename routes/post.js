const express = require('express');
const isLogin = require('../middlewares/isLogin');
const isSuspended = require('../middlewares/isSuspended');

const { createPost, getPosts, getPost } = require('../controllers/post');

const router = express.Router();

router.route('/').get(isLogin, getPosts).post(isLogin, isSuspended, createPost);
router.route('/:id').get(isLogin, getPost);

module.exports = router;
