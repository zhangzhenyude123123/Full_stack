var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require("express-session");
var MongoStore = require('connect-mongo');
var flash = require('connect-flash');

var settings = require('./setting');
var indexRouter = require('./routes/index');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// app.use(session({
//   secret:settings.cookieSecret,            //用来防止篡改cookie
//   key:settings.db,                        //cookie's name
//   cookie:{maxAge:1000*60*60*24*30},       //30days
//   store: new MongoStore({
//     db:settings.db,
//     host:settings.host,
//     port:settings.port,
//     url: 'mongodb://localhost/eforum'
//   }),
//   resave:true,
//   saveUninitialized:false
// }));


app.use(flash());
// app.dynamicHelpers({
//   user: function(req, res) {
//     return req.session.user;
//   },
//   error: function(req, res) {
//     var err = req.flash('error');
//     if (err.length)
//       return err;
//     else
//       return null;
//   },
//   success: function(req, res) {
//     var succ = req.flash('success');
//     if (succ.length)
//       return succ;
//     else
//       return null;
//   },
// });

//Test db connected
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/eforum');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Successful connection to Mongodb");
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
