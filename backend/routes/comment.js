const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');
const valid = require('../middleware/valid-input');
const status = require('../middleware/check-status');

router.post('/', auth, valid.comment, commentCtrl.newComment);
router.get('/', auth, valid.postId, commentCtrl.getCommentsofPost);
router.delete('/:id', auth, valid.id, status.deleteComment, commentCtrl.deleteComment);

module.exports = router;