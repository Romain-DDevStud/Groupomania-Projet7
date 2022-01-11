const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const postCtrl = require('../controllers/post');

router.post('/', auth, multer, postCtrl.createPost);
router.get('/', postCtrl.getAllPosts);
router.get('/:id/comments', postCtrl.getAllComments);
router.delete('/:id', auth, postCtrl.deletePost);

module.exports = router;