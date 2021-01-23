const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const homeRoutes = require('./routes/home.routes');
const coursesRoutes = require('./routes/courses.routes');
const addRoutes = require('./routes/add.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');
const authRoutes = require('./routes/auth.routes');
const User = require('./models/User');
const varMiddleware = require('./middleware/variables');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use( async (req, res, next) => {
  try {
    const user = await User.findById('600abb12de34f5544f317107');
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false
}));
app.use(varMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.port || 3000;

async function start() {
  try {
    const url = 'mongodb+srv://maxim:cnfYcTvCKuIq692T@cluster0.zp2oe.mongodb.net/shop';
    await mongoose.connect(url, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'Maxim@gmail.com',
        name: 'Maxim',
        cart: { items: [] }
      });
      await user.save()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start();