const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// posts
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);

// gets
router.get('/me', protect, getMe);

// puts
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
