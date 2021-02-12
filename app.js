const path = require('path');
//set local variable
require('dotenv').config({ path: 'config.env' });

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const errorRoute = require('./routes/error');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('60211310d1d20b2108efa7dd')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoute);
app.use(errorController.get404);

mongoConnect((collection) => {
  app.listen(3000);
});
