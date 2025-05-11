const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express();
mongoose.connect('mongodb://localhost:27017/crypto-track')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/uploads', express.static('uploads'))



app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api', require('./routes/user-router'))
app.use('/api/coins', require('./routes/coin-router'))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
