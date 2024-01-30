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
  suspendUser,
  unSuspendUser,
  updateUserPassword
} = require('../controllers/user');

router.route('/').get(isLogin, getAllUsers);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/profile').get(isLogin, isSuspended, userProfile);
router.route('/:id').delete(deleteUser)

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
router.route('/block-user/:id').post(isLogin, isSuspended, blockUser);
router.route('/unblock-user/:id').post(isLogin, isSuspended, unblockUser);
router.route('/suspend-user/:id').post(isLogin, isAdmin, suspendUser);
router.route('/unsuspend-user/:id').post(isLogin, isAdmin, unSuspendUser);
router.route('/update-me').patch(isLogin, isSuspended, updateUser)
router.route('/update-password').patch(isLogin, isSuspended, updateUserPassword)

module.exports = router;
