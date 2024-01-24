const express = require('express');
const router = express.Router();
const isLogin = require('../middlewares/isLogin');
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
} = require('../controllers/user');

router.route('/').get(isLogin, getAllUsers);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/profile').get(isLogin, userProfile);
router.route('/:id').delete(deleteUser).put(updateUser);
router
  .route('/profile-photo-upload')
  .post(isLogin, upload.single('profile'), profilePhotoUpload);

router.route('/view-profile/:id').get(isLogin, viewProfile);

module.exports = router;
