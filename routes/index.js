var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    fs = require('fs');
/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

/*module.exports = router;*/

module.exports = function(app) {
  app.get('/', function (req, res) {
    Post.getTen(function (err, posts) {
      //console.log(posts);
      //console.log(req.session.user)
      res.render('index', {
        title: 'Home',
        user: req.session.user,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
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
    res.render('post', {
      title: 'Post' ,
      user: req.session.user,
      success: req.flash('success').toString(),
      error:req.flash('error').toString()});
  });
  app.post('/post', checkLogin);
  app.post('/post', function(req, res){
    if (req.body.top){
      var top = 1;
    }
    else{
      top = 0;
    }
    var currentUser = req.session.user,
        category = req.body.category
        post = new Post(currentUser.name, req.body.title, req.body.content,top,category);
    post.save(function (err) {
      if (err){
        req.flash('error',err);
        return res.redirect('/');
      }
      req.flash('success', 'Post Successful!');
      res.redirect('/');
    });
  });
  app.get('/upload', checkLogin);
  app.get('/upload', function(req,res){
    res.render('upload', {
      title:'Upload',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });
  app.post('/upload',checkLogin);
  app.post('/upload', function(req,res){
    console.log(req.files);
    for(var i in req.files) {
      if(req.files[i].size == 0) {
        fs.unlinkSync(req.files[i].path); // 使用同步方式删除一个文件
        console.log('Successfuly removed an empty file!');
      }
      else {
        var target_path = './public/images/' + req.session.user.name;
        //console.log(target_path);
        fs.rename(req.files[i].path, target_path); // 使用同步方式重命名一个文件
        console.log('Successfuly renamed a file!');
      }
    }
    req.flash('success', 'The file upload succeed.');
    res.redirect('/upload');
  });
  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success','Logout Successful!');
    res.redirect('/')
  });
  app.get('/p/:_id', function(req, res){
    Post.getOne(req.params._id, function(err, post){
      if (err){
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('article',{
        title: post.title,
        post: post,
        user: req.session.user,
        success:req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
  app.get('/edit/:_id',checkLogin);
  app.get('/edit/:_id', function(req,res){
    Post.edit(req.params._id, function(err, post){
      if (err){
        req.flash("error", 'This blog does not exist');
        return res.redirect('/');
      }
      res.render('edit',{
        title: post.title,
        user: req.session.user,
        post: post,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
      });
    });
  });
  app.post('/edit/:_id',checkLogin);
  app.post('/edit/:_id', function(req,res){
    if (req.body.top){
      var top = 1;
    }
    else{
      top = 0;
    }
    var newpost = new Post(req.session.user.name,req.body.title,req.body.content,top,req.body.category);
    Post.update(req.params._id,newpost,function(err,post){
      var url = encodeURI('/p/'+post._id);
      if (err){
        req.flash('error',err.toString());
        return res.redirect('/');}
      else{
        req.flash('success','Update Succeed.');
        res.redirect(url);
      }
    })
  });
  app.get('/remove/:_id', function(req,res){
    Post.remove(req.params._id,function(err,post){
      if (err){
        req.flash('error', err.toString());
        return res.redirect('/');
      }
      else{
        req.flash('success', 'Remove Succeed');
        res.redirect('/');
      }
    })
  });
  app.get('/data',function(req,res){
    Post.getAll(null, function (err, posts) {
      //console.log(posts);
      //console.log(req.session.user)
      res.send(posts);})
  });
  app.get('/categories',function(req,res){
    Post.getcategories(function(err,categories){
      res.json(categories);
    })
  });
  app.get('/archive', function (req, res) {
    res.render('archive', {
      title: 'Archive' ,
      user: req.session.user,
      success: req.flash('success').toString(),
      error:req.flash('error').toString()});
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