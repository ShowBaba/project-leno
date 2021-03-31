/* eslint-disable no-console */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const config = require('./config');

dotenv.config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.get('/api/v1', (req, res) => {
  res.json({ status: 'success', message: 'Welcome To Leno API' });
});
app.use('/api/v1', indexRouter);
app.use('/api/v1/auth', usersRouter);

// set up a wildcard route
app.get('*', (req, res) => {
  res.redirect('/index');
});

// eslint-disable-next-line no-unused-vars
const localUrl = process.env.CONNECTION_STRING_DEV;
console.log(localUrl)
const liveUrl = process.env.DB_CONNECTION;
const connect = mongoose.connect(localUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// establish connection
connect.then(
  // eslint-disable-next-line no-unused-vars
  (db) => {
    console.log('Connected to Database');
  },
  (err) => {
    console.log(err);
  }
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
