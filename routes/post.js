const express = require('express');
const isLogin = require('../middlewares/isLogin');
const isSuspended = require('../middlewares/isSuspended');
const isBlocked = require('../middlewares/isBlocked');
const hidePosts = require('../middlewares/hidePosts');
const storage = require('../config/cloudinary');
const multer = require('multer');

const {
  createPost,
  getPostsOfFollowedUsers,
  getPost,
  getFeed,
  likePost,
  disLikePost,
  deletePost,
  updatePost,
} = require('../controllers/post');

const router = express.Router();

// multer configuration
const upload = multer({ storage });

router
  .route('/')
  .get(isSuspended, getFeed)
  .post(isLogin, isSuspended, upload.single('image'), createPost); // upload.single('image')

router
  .route('/posts-of-following-user')
  .get(isLogin, isSuspended, getPostsOfFollowedUsers);

router
  .route('/:id')
  .get(isLogin, isSuspended, hidePosts, getPost)
  .delete(isLogin, isSuspended, deletePost)
  .patch(isLogin, isSuspended, updatePost);

router.route('/like-post/:id').post(isLogin, isSuspended, hidePosts, likePost);
router
  .route('/dislike-post/:id')
  .post(isLogin, isSuspended, hidePosts, disLikePost);

module.exports = router;
