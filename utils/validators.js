const { body } = require('express-validator/check');
const User = require('../models/User');

exports.registerValidators = [
  body('email', 'Enter correct email').isEmail().custom(async (value, { req }) => {
    try {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject('User with this email already exist');
      }
    } catch (error) {
      console.log(error);
    }
  }),
  body('password', 'Password should be min 6 signs').isLength({ min: 6, max: 56 }).isAlphanumeric(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match')
    }
    return true;
  }),
  body('name', 'Name shoud be min 3 signs').isLength({ min: 3 })
]