const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const commentCtrl = require('../controllers/comment');

router.post('/', auth, multer, commentCtrl.createComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

module.exports = router;