const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home.routes');
const coursesRoutes = require('./routes/courses.routes');
const addRoutes = require('./routes/add.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);

const PORT = process.env.port || 3000;

async function start() {
  try {
    const url = 'mongodb+srv://maxim:cnfYcTvCKuIq692T@cluster0.zp2oe.mongodb.net/<dbname>?retryWrites=true&w=majority';
    await mongoose.connect(url, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  } catch (error) {
    console.log(error);
  }
}

start();