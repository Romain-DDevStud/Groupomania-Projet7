const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const postCtrl = require('../controllers/post');
const valid = require('../middleware/valid-input');
const status = require('../middleware/check-status');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, valid.postContent, postCtrl.newPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, valid.id, postCtrl.getOnePost);
router.get('/:limit/:offset', auth, valid.getSomePosts, postCtrl.getSomePosts);
router.delete('/:id', auth, valid.id, status.deletePost, postCtrl.deletePost);

module.exports = router;