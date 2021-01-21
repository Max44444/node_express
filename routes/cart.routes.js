const { Router } = require('express');
const Cart = require('../models/Cart');
const Course = require('../models/Course');
const router = Router();

router.post('/add', async (req, res) => {
  const course = await Course.getById(req.body.id);
  await Card.add(course);
  res.redirect('/card');
})

router.get('/', async (req, res) => {
  const cart = await Cart.fetch();
  res.render('cart', {
    title: 'Cart',
    cart
  })
})

module.exports = router;