const express = require('express');
const router = express.Router();
const isLogin = require('../middlewares/isLogin');

const { register, login, userProfile, deleteUser, updateUser } = require('../controllers/user');

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/:id').get(isLogin,userProfile).delete(deleteUser).put(updateUser)

module.exports = router;
