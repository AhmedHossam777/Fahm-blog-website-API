const express = require('express');
const router = express.Router();
const isLogin = require('../middlewares/isLogin');
const isBlocked = require('../middlewares/isBlocked');
const storage = require('../config/cloudinary');
const multer = require('multer');

const upload = multer({ storage });

const {
  register,
  login,
  userProfile,
  deleteUser,
  updateUser,
  profilePhotoUpload,
  viewProfile,
  getAllUsers,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
} = require('../controllers/user');

router.route('/').get(isLogin, getAllUsers);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/profile').get(isLogin, userProfile);
router.route('/:id').delete(deleteUser).put(updateUser);
router
  .route('/profile-photo-upload')
  .post(isLogin, upload.single('profile'), profilePhotoUpload);

router.route('/view-profile/:id').get(isLogin, isBlocked, viewProfile);
router.route('/follow-user/:id').post(isLogin, isBlocked, followUser);
router.route('/unfollow-user/:id').post(isLogin, unfollowUser);
router.route('/block-user/:id').post(isLogin, blockUser);
router.route('/unblock-user/:id').post(isLogin, unblockUser);

module.exports = router;
