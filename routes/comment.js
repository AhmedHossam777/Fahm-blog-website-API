const express = require('express');
const { getComment, getComments, createComment } = require('../controllers/comment');

const router = express.Router();

router.route('/').get(getComments).post(createComment);
router.route('/:id').get(getComment)


module.exports = router;