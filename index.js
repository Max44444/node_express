const express = require('express');
const path = require('path');
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

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})