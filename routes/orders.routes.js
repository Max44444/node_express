const { Router } = require('express');
const Order = require('../models/Order');
const router = Router();

router.get('/', async (req, res) => {
  res.render('orders', {
    isOrders: true,
    title: 'Orders'
  })
})

router.post('/', async (req, res) => {
  res.redirect('/orders');
})

module.exports = router;