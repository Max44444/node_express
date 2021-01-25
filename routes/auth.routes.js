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

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, repeat } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      res.redirect('/auth/login#register')
    } else {
      const user = new User({ email, name, password, cart: { items: [] } })
      await user.save();
      res.redirect('/auth/login#login')
    }
  } catch (error) {
    console.log(error);
  }
})

module.exports = router