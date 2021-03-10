const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
} = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// posts
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);

// gets
router.get('/me', protect, getMe);
router.get('/logout', logout);

// puts
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
