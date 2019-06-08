var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require("./log");
var roles = require('./module/roles');
global.dirname = __dirname;
var app = express();

//mysql
var connection = require('./module/connection');
connection.init();
var authority = require('./passport/authority');

//log4js configure
log4js.configure();
app.use(log4js.useLog());

//passport
var session = require('express-session');
var flash = require('express-flash');
var passport = require('passport');
require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// required for passport
app.use(session({
  secret: 'vidyapathaisalwaysrunning',
  resave: true,
  saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(roles.middleware());//权限管理中间件

/* 加载路由*/
require('./routes/users')(app, passport);
app.use('/', authority.isAuthenticated,require('./routes/index'));
app.use('/nodeControl',require('./routes/nodeControl'));
app.use('/member',authority.isAuthenticated,roles.can('access user page'),require('./routes/member'));
app.use('/project',authority.isAuthenticated,require('./routes/project'));
app.use('/equipment',authority.isAuthenticated,require('./routes/equipment'));
app.use('/camera',authority.isAuthenticated,require('./routes/camera'));
app.use('/preset',authority.isAuthenticated,require('./routes/preset'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
