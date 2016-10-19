'use strict'
var express = require('express');
var passport = require('passport');
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

module.exports = function (app) {
  app.get('/helloworld', function (req, res) {
    res.send('hello world')
  });
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
      title: 'Register',
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
    if (password_re !== password) {
      req.flash('error', 'Password mismatch!');
      console.log('Password mismatch!');
      return res.redirect('/reg');//返回注册页
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5');
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
        return res.redirect('/blog');
      }
      if (user) {
        req.flash('error', 'Username exist!');
        console.log('Username exist!');
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
        res.redirect('/blog');//注册成功后返回主页
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
      res.redirect('/blog');
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
        category = req.body.category,
        post = new Post(currentUser.name, req.body.title, req.body.content,top,category);
    post.save(function (err) {
      if (err){
        req.flash('error',err);
        return res.redirect('/blog');
      }
      req.flash('success', 'Post Successful!');
      res.redirect('/blog');
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
    res.redirect('/blog')
  });
  app.get('/p/:_id', function(req, res){
    Post.getOne(req.params._id, function(err, post){
      if (err){
        req.flash('error', err);
        return res.redirect('/blog');
      }
      res.render('article',{
        title: post.title,
        postId: post._id,
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
        return res.redirect('/blog');
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
        return res.redirect('/blog');}
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
        return res.redirect('/blog');
      }
      else{
        req.flash('success', 'Remove Succeed');
        res.redirect('/');
      }
    })
  });
  app.get('/data',function(req,res){
    var options = {
      sort: {
        top: -1,
        time_for_sort: -1
      }};
    Post.getAll(null, options,function (err, posts) {
      res.send(posts);})
  });
  app.get('/articleData',function(req,res){
    var options = {
      sort: {
        time_for_sort: -1
      }};
    Post.getAll(null, options,function (err, posts) {
      res.send(posts);})
  });
  app.get('/categories',function(req,res){
    Post.getcategories(function(err,categories){
      res.json(categories);
    })
  });
  app.get('/userimage/:name',function(req,res){
    User.getimage(req.params.name, function(err,userimages){
      res.json(userimages);
    })
  });
  app.get('/blog', function (req, res) {
    res.render('blog', {
      title: 'Blog' ,
      user: req.session.user,
      success: req.flash('success').toString(),
      error:req.flash('error').toString()});
  });
  app.get('/about', function (req, res) {
    res.render('about', {
      title: 'About Me' ,
      user: req.session.user,
      success: req.flash('success').toString(),
      error:req.flash('error').toString()});
  });
  app.get('/contact', function (req, res) {
    res.render('contact', {
      title: 'Get In Touch' ,
      user: req.session.user,
      success: req.flash('success').toString(),
      error:req.flash('error').toString()});
  });
  app.get('/project', function (req, res) {
    res.render('project', {
      title: 'Projects' ,
      user: req.session.user,
      success: req.flash('success').toString(),
      error:req.flash('error').toString()});
  });
  app.get('/thanks', function (req, res) {
    res.render('thanks', {
      title: 'Thank You' ,
      user: req.session.user,
      success: req.flash('success').toString(),
      error:req.flash('error').toString()});
  });
  app.get('/u/:username', function(req,res){
    var image_url;
    Post.getAll(req.params.username,function(err,posts){
      if (err) {
        req.flash('error', err);
        return res.redirect('/blog');
      }
      User.getimage(req.params.username, function (err,image) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/blog');
        }
        image_url = image;
        res.render('user', {
          title: req.params.username,
          imageurl: image_url,
          posts: posts,
          user : req.session.user,
          success : req.flash('success').toString(),
          error : req.flash('error').toString()
        });
      });
    });
  });
  app.get('/:category', function(req,res){
    Post.getOnecategory(req.params.category,function(err,posts){
      if (err){
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('user', {
        title: req.params.category,
        posts: posts,
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
      });
    })
  });
  app.get("/login/github", passport.authenticate("github", {session: false}));
  app.get("/login/github/callback", passport.authenticate("github", {
    session: false,
    failureRedirect: '/login',
    successFlash: 'Login Succeed！'
  }), function (req, res) {
    console.log(req.user);
    req.session.user = {name: req.user.username, head: "https://gravatar.com/avatar/" + req.user._json.gravatar_id};
    res.redirect('/blog');
  });
  app.get('/login/facebook', passport.authenticate('facebook'));
  app.get('/login/facebook/callback',
      passport.authenticate('facebook', {
        session: false,
        successFlash: 'Login Succeed! ',
        failureRedirect: '/login'
      }), function (req,res){
        console.log(req.user);
        req.session.user = {name: req.user.displayName, head: "https://gravatar.com/avatar/" + req.user._json.gravatar_id + "?s=48"};
        res.redirect('/blog');
      });
  app.use(function (req, res) {
    res.render("404");
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