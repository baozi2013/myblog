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
    , GithubStrategy = require('passport-github').Strategy;
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
  clientID: "9a5368a8000005fd0d21",
  clientSecret: "5a45aca590ddfb74674a439d9e71c52ab0a1973f",
  callbackURL: "http://localhost:3000/login/github/callback"
}, function(accessToken, refreshToken, profile, done) {
  done(null, profile);
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