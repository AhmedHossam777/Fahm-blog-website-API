const express = require('express');
const {
  getComment,
  getCommentsOfPost,
  createComment,
  updateComment,
  deleteComment,
  likeComment
} = require('../controllers/comment');

const isLogin = require('../middlewares/isLogin');
const isSuspended = require('../middlewares/isSuspended');

const router = express.Router();

router.route('/').post(isLogin, isSuspended, createComment);
router
  .route('/:id')
  .get(isLogin, isSuspended, getComment)
  .patch(isLogin, isSuspended, updateComment)
  .delete(isLogin, isSuspended, deleteComment);
router.route('/post/:id').get(isLogin, isSuspended, getCommentsOfPost);
router.route('/like-comment/:id').patch(isLogin, isSuspended, likeComment);

module.exports = router;
