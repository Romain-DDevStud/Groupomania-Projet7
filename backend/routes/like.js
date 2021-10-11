const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/like');
const valid = require('../middleware/valid-input');

router.post('/', auth, valid.like, likeCtrl.rate);
router.get('/', auth, valid.postId, likeCtrl.getLikesOfPost);

module.exports = router;