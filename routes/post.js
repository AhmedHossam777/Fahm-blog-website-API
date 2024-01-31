const express = require('express');
const isLogin = require('../middlewares/isLogin');
const isSuspended = require('../middlewares/isSuspended');

const {
  createPost,
  getPostsOfFollowedUsers,
  getPost,
  getFeed,
} = require('../controllers/post');

const router = express.Router();

router
  .route('/')
  .get(isLogin, isSuspended, getFeed)
  .post(isLogin, isSuspended, createPost);

router
  .route('/posts-of-following-user')
  .get(isLogin, isSuspended, getPostsOfFollowedUsers);

router.route('/:id').get(isLogin, isSuspended, getPost);

module.exports = router;
