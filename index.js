const express = require('express');
const path = require('path');
const csrf = require('csurf');
const { flash } = require('express-flash-message');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require('./routes/home.routes');
const coursesRoutes = require('./routes/courses.routes');
const addRoutes = require('./routes/add.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');
const authRoutes = require('./routes/auth.routes');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const keys = require('./keys');

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrf());
app.use(flash({ sessionKeyName: 'some text' }));
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.port || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start();