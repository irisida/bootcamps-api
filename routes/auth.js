const express = require('express');
const { register, login, getMe } = require('../controllers/auth');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// posts
router.post('/register', register);
router.post('/login', login);

// gets
router.get('/me', protect, getMe);

module.exports = router;
