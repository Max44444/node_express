const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const nodeMailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require('../models/User');
const keys = require('../keys');
const regEmail = require('../emails/registration');
const router = Router();
const resetEmail = require('../emails/reset');
const { registerValidators } = require('../utils/validators');

const transporter = nodeMailer.createTransport(sendgrid({
  auth: { api_key: keys.SENDGRID_API_KEY }
}));

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Authorization',
    isLogin: true,
    loginError: await req.consumeFlash('loginError'),
    registerError: await req.consumeFlash('registerError')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save(err => {
          if (err) {
            throw err
          }
          res.redirect('/');
        })
      } else {
        await req.flash('loginError', 'Enter correct password');
        res.redirect('/auth/login#login');
      }
    } else {
      await req.flash('loginError', 'Enter correct email');
      res.redirect('/auth/login#login');
    }
  } catch (error) {
    console.log(error);
  }
})

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await req.flash('registerError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register')
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email, name, password: hashPassword, cart: { items: [] } 
    })
    await user.save();
    await transporter.sendMail(regEmail(email));
    res.redirect('/auth/login#login');
  } catch (error) {
    console.log(error);
  }
})

router.get('/reset', async (req, res) => {
  res.render('auth/reset', {
    title: 'Forgot the password?',
    error: await req.consumeFlash('error')
  })
})

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }

  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() }
    })

    if (!user) {
      return res.redirect('/auth/login');
    } else {
      res.render('auth/password', {
        title: 'Restore access',
        error: await req.consumeFlash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        await req.flash('error', 'Something goes wrong, please try again later');
        return res.redirect('/auth/reset');
      }

      const token = buffer.toString('hex');

      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 3600000;
        await candidate.save();
        await transporter.sendMail(resetEmail(candidate.email, token));
        res.redirect('/auth/login');
      } else {
        req.flash('error', 'There is no such email');
        res.redirect('/auth/reset');
      }
    })
  } catch (error) {
    console.log(error);
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() }
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect('/auth/login');
    } else {
      req.flash('loginError', 'Еoken expired');
      res.redirect('/auth/login');
    }
  } catch (error) {
    console.log(error); 
  }
})

module.exports = router