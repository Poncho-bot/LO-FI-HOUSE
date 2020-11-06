var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var InitiateMongoServer = require("./config/db");
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var PayPalCheckoutButton = require('./public/components/PaypalCheckoutButton');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var acercade = require('./routes/acercade');

var app = express();

const order = {
  customer: 'test',
  total: '550.00',
  items: [
    {
      sku: '112',
      name: 'Camisa ReactJS',
      price: '300.00',
      quantify: 1,
      currency: 'MXN'
    },
    {
      sku: '99',
      name: 'Camisa JS',
      price: '125.00',
      quantify: '2',
      currency: 'MXN'
    }
  ]
};



//Inicializa la base de datos
InitiateMongoServer();
app.use(bodyParser.json()); //convierte el dato a formato JSON

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/acercade', acercade);

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
