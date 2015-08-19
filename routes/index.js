var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/user.js');
/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/*module.exports = router;*/

module.exports = function(app) {
  app.get('/', function (req, res) {
    res.render('index', {
      title: 'Home' ,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()});
  });
  app.get('/reg',checkNotLogin);
  app.get('/reg', function (req, res) {
    res.render('register',{
      title: 'Registration',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/reg',checkNotLogin);
  app.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      req.flash('error', 'Password mismatch!');
      console.log('Password mismatch!')
      return res.redirect('/reg');//返回注册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      if (user) {
        req.flash('error', 'Username exist!');
        console.log('Username exist!')
        return res.redirect('/reg');//返回注册页
      }
      //如果不存在则新增用户
      newUser.save(function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');//注册失败返回主册页
        }
        req.session.user = user;//用户信息存入 session
        req.flash('success', 'Registration Succeed!');
        res.redirect('/');//注册成功后返回主页
      });
    });
  });
  app.get('/login', checkNotLogin);
  app.get('/login', function (req, res) {
    res.render('login', {
      title: 'Login',
      user: req.session.user,
      success: req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
  app.post('/login',checkNotLogin);
  app.post('/login',function(req, res){
    var password = crypto.createHash('md5').update(req.body.password).digest('hex');
    User.get(req.body.name, function (err,user){
      if (!user){
        req.flash('error', 'User does not exist');
        return res.redirect('/login')
      }
      if (user.password != password){
        req.flash('error', 'Wrong Password');
        return res.redirect('login');
      }
      req.session.user = user;
      req.flash('success', 'Login Successful');
      res.redirect('/');
    });
  });
  app.get('/post', function (req, res) {
    res.render('index', { title: 'Post' });
  });
  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success','Logout Successful!');
    res.redirect('/')
  });
};
function checkLogin(req,res,next){
  if (!req.session.user){
    req.flash('error','No login yet');
    res.redirect('/login');
  }
  next();
}
function checkNotLogin(req,res,next){
  if (req.session.user){
    req.flash('error', 'Login done');
    res.redirect('back');
  }
  next();
}