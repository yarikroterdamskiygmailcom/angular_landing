const express = require('express')
const passport = require('passport')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var paypal = require('paypal-rest-sdk');
var path = require('path');


const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const tariffRoutes = require('./routes/tariff')
const stripeRoutes = require('./routes/stripe-order')
const paypalRoutes = require('./routes/paypal-order')



const app = express();
const router = express.Router();

const options = {
  dotfiles: 'allow',
  etag: false,
  extensions: ['jpeg', 'png'],
  index: false,
  maxAge: '7d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use('/uploads', express.static(__dirname + '/uploads'));
//app.use('/uploads', express.static('uploads'))
//app.use(express.static(path.join(__dirname, 'uploads')));
//app.use(express.static('uploads'))

app.use(require('morgan')('dev'))
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/matches', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully!');
});

app.use(passport.initialize())
require('./middleware/passport')(passport)



app.use('/matches/auth', authRoutes);
app.use('/matches/profile', profileRoutes);
app.use('/matches/tariff', tariffRoutes);
app.use('/matches/stripe', stripeRoutes);
app.use('/matches/paypal', paypalRoutes);


app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));