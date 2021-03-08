const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name value'],
  },
  email: {
    type: String,
    required: [true, 'Please add a valid email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['user', 'publisher'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Encrypt password using bcrypt.
 * Checks if the user has been modified and the password has changed.
 * If so it will generate the salt and hash the new password.
 * If not so, the next() is called.
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * sign JWT and return it to the client
 */
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/**
 * match user entered password to hasjed in password in the DB
 */
UserSchema.methods.matchPassword = async function (userEnteredPassword) {
  return await bcrypt.compare(userEnteredPassword, this.password);
};

/**
 * generate and hash password token
 */
UserSchema.methods.getResetPasswordToken = function () {
  // gen token
  const resetToken = crypto.randomBytes(20).toString('hex');
  // hash token and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
