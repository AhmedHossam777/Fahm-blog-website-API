const express = require('express');

const router = express.Router();

const { register, login, userProfile, deleteUser, updateUser } = require('../controllers/user');

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/:id').get(userProfile).delete(deleteUser).put(updateUser)

module.exports = router;
