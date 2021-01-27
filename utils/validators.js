const { body } = require('express-validator/check');

exports.registerValidators = [
  body('email', 'Enter correct email').isEmail(),
  body('password', 'Password should be min 6 signs').isLength({ min: 6, max: 56 }).isAlphanumeric(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match')
    }
    return true;
  }),
  body('name', 'Name shoud be min 3 signs').isLength({ min: 3 })
]