const { Router } = require('express');
const { validationResult } = require('express-validator/check');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const router = Router();

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add course',
    isAdd: true
  });
});

router.post('/', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add course',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img
      }
    })
  }

  const {title, price, img} = req.body;
  const course = new Course({ 
    title,
    price,
    img,
    userId: req.user
  });

  try {
    await course.save();
    res.redirect('/courses');
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;