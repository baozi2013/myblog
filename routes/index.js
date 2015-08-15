var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/*module.exports = router;*/

module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('index', { title: 'Home' });
  });
  app.get('/reg', function (req, res) {
    res.render('register', { title: 'Register' });
  });
  app.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
  });
  app.get('/post', function (req, res) {
    res.render('index', { title: 'Post' });
  });
  app.get('/logout', function (req, res) {
    res.render('index', { title: 'Home' });
  });
};
