const { Router } = require('express');
const User = require('../models/User');
const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
})

router.post('/login', async (req, res) => {
  const user = await User.findById('600abb12de34f5544f317107');
  req.session.user = user;
  req.session.isAuthenticated = true;
  req.session.save(err => {
    if (err) {
      throw err
    }
    res.redirect('/');
  })
})

module.exports = router