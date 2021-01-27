var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var config = require("./db_config.js");
var expressSession = require('express-session');
var debug = require('debug')('sc-new:server');

if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();  
}




var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');
const { info } = require('console');

// For our sessions
var secret = process.env.SECRET;

// Connection details, supports pooling
// See db_config.js
const pool = mysql.createPool(config.connection);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev', { stream: { write: msg => debug(msg) } }));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cookieParser());
app.use(expressSession({
  secret: secret,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Passport configuration
passport.use(new LocalStrategy({
    usernameField: 'pin',
    passwordField: 'password'
  },
  function (username, password, done) {
    pool.execute("SELECT * FROM users WHERE Pin = ?;",
      [username],
      function (err, rows) {
        if (err) {
          return done(err);
        }

        if (rows.length == 1) {
          return done(null, rows[0], {
            code: 0,
            message: "Login success, redirecting..."
          });

        } else {
          return done(null, false, {
            code: 1,
            message: 'Incorrect pin.'
          });
        }
      });
  }
));

// Passport method to serialize a user
passport.serializeUser(function (user, done) {
  done(null, user.UserID);
});

// Passport method to deserialize a user
passport.deserializeUser(function (id, done) {
  pool.execute("SELECT * FROM users WHERE UserID = ?;",
    [id],
    function (err, rows) {
      done(err, rows[0]);
    });
});

module.exports = app;