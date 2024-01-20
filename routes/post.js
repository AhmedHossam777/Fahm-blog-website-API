const express = require('express');

const { createPost, getPosts, getPost } = require('../controllers/post');

const router = express.Router();

router.route('/').get(getPosts).post(createPost);
router.route('/:id').get(getPost);

module.exports = router;
