const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');
const valid = require('../middleware/valid-input');
const status = require('../middleware/check-status');
const multer = require('../middleware/multer-config');

router.post('/signup', valid.newUSer, userCtrl.newUser);
router.post('/login', valid.login, userCtrl.login);
router.get('/logout', userCtrl.logout);
router.get('/isauth', auth, userCtrl.isAuth);
router.get('/currentuser', auth, userCtrl.getCurrentUser);
router.get('/', auth, userCtrl.getAllUsers);
router.get('/search', auth, valid.searchUser, userCtrl.searchUsers);
router.get('/:id', auth, valid.id, userCtrl.getOneUser);
router.get('/:id/posts', auth, valid.id, userCtrl.getAllPostsOfUser);
router.put('/:id/password', auth, valid.id, valid.changePassword, status.sameUser, userCtrl.changePassword);
router.put('/:id/picture', auth, valid.id, status.sameUser, multer, userCtrl.changeProfilePicture);
router.put('/:id/admin', auth, valid.id, valid.adminCredential, status.isAdmin, userCtrl.changeAdmin);
router.delete('/:id', auth, valid.id, status.sameUser, userCtrl.deleteAccount);

module.exports = router;