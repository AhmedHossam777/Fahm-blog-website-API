const express = require('express');
const router = express.Router();
const isLogin = require('../middlewares/isLogin');
const isBlocked = require('../middlewares/isBlocked');
const isAdmin = require('../middlewares/isAdmin');
const isSuspended = require('../middlewares/isSuspended');
const storage = require('../config/cloudinary');
const multer = require('multer');

const upload = multer({ storage });

const {
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
  suspendUser,
  unSuspendUser,
} = require('../controllers/user');

const { register, login, refreshToken,  updateUserPassword,logout } = require('../controllers/auth');

// Auth
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/refresh-token').post(refreshToken);
router
  .route('/update-password')
  .patch(isLogin, isSuspended, updateUserPassword);


router.route('/').get(isLogin, getAllUsers);
router.route('/profile').get(isLogin, isSuspended, userProfile);
router
  .route('/profile-photo-upload')
  .post(isLogin, isSuspended, upload.single('profile'), profilePhotoUpload);

router
  .route('/view-profile/:id')
  .get(isLogin, isSuspended, isBlocked, viewProfile);

router
  .route('/follow-user/:id')
  .post(isLogin, isSuspended, isBlocked, followUser);
router.route('/unfollow-user/:id').post(isLogin, isSuspended, unfollowUser);

router.route('/block-user/:id').patch(isLogin, isSuspended, blockUser);
router.route('/unblock-user/:id').patch(isLogin, isSuspended, unblockUser);
router.route('/suspend-user/:id').patch(isLogin, isAdmin, suspendUser);
router.route('/unsuspend-user/:id').patch(isLogin, isAdmin, unSuspendUser);
router.route('/update-me').patch(isLogin, isSuspended, updateUser);
router.route('/delete-me').delete(isLogin, deleteUser);


module.exports = router;
