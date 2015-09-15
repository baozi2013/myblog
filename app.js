var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var user = require('./models/user');
var config = require('./models/config').dev;
var settings = require('./settings');
var app = express();
var passport = require('passport')
    , GithubStrategy = require('passport-github').Strategy
    ,FacebookStrategy = require('passport-facebook').Strategy;
var flash = require('connect-flash');
var multer = require('multer');
var methodOverride = require('method-override');
var multipart = require('connect-multiparty');
//var upload = multer({
//  dest: './public/images',
//  rename: function(fieldname, filename){
//    return filename;
//  }});
// view engine setup
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser({keepExtensions: true, uploadDir: path.join(__dirname, '/files')}));
app.use(multipart());
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

//var env = process.env.NODE_ENV =  process.env.NODE_ENV || 'dev';
//var config = require('./models/config')[env];
//var db = require('./models/db');
//console.log(db)
//app.use(upload.single('file'));
//app.post('/upload', function(req,res){
//  onsole.log(req.body);
//  console.log(req.files);
//  res.status(204).end();
//});
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    url: config.connectionstring,
    ttl: 14 * 24 * 60 * 60
  })
}));


routes(app);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
app.use(passport.initialize());
passport.use(new GithubStrategy({
  clientID: "4eefd14dac3876900d82",
  clientSecret: "9744e302c5367465c2c99e239dfde5ac0d7acd1c",
  callbackURL: "https://thzlab.herokuapp.com/login/github/callback"
}, function(accessToken, refreshToken, profile, done) {
  done(null, profile);
}));
passport.use(new FacebookStrategy({
      clientID: "1615330155411315",
      clientSecret: "05ed6a8c8ca43b7cb2e4615ce9755a1b",
      callbackURL: "https://thzlab.herokuapp.com/login/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }));
/*app.use('/', routes);
app.use('/users', users);*/

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

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;