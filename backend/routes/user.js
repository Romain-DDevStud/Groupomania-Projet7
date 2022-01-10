const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/account', userCtrl.getCurrentUser);
router.get('/accounts', userCtrl.getAllUsers);
router.delete('/account', userCtrl.deleteUser);

module.exports = router;