/**
 * Created by tianhengzhou on 8/18/15.
 */
var db = require('./db'),
    markdown = require('markdown').markdown;

var postSchema = new db.Schema({
    name: String,
    title: String,
    content: String,
    time: String,
    time_for_sort: Number,
    top: Number,
    category: String
});

var postModel = db.model('Post',postSchema);

function Post(name,title,content,top,category){
    this.name = name;
    this.title = title;
    this.content = content;
    this.top = top;
    this.category = category;
}

Post.prototype.save = function(callback){
    var date = new Date();
    var time = date.toString();
    var time_for_sort = Date.now();
    var post = {
        name: this.name,
        title: this.title,
        content: this.content,
        time: time,
        time_for_sort: time_for_sort,
        top: this.top,
        comments: [],
        category: this.category
    };
    var newPost = new postModel(post);

    newPost.save(function(err,post){
        if (err){
            return callback(err);
        }
        callback(null, post);
    })
};

Post.getAll = function (name, callback) {
    options = {
        sort: {
            top: -1,
            time_for_sort: -1
    }};
    if (!name){
        postModel.find({},null,options,function(err,posts){
            if (err){
                return callback(err);
            }
            callback(null, posts);
        });
    }
    else {
        postModel.find({name: name},null,options, function (err, posts) {
            if (err) {
                return callback(err);
            }
            posts.foreach(function(post){
                post.content = markdown.toHTML(post.content)
            });
            callback(null, posts);
        });
    }
};

Post.getOne = function(_id, callback){
    postModel.findById(_id, function(err,post){
        if (err){
            return callback(err);
        }
        post.content = markdown.toHTML(post.content);

        callback(null,post);
    })
};

Post.edit = function(_id, callback){
  postModel.findOne({_id: _id},function(err,post){
      if(err){
          return callback(err);
      }
      callback(null,post);
  })
};

Post.update = function(_id, newpost, callback){
    var date = new Date();
    newpost.time = date.toString();
    newpost.time_for_sort = Date.now();
    postModel.findOneAndUpdate({_id: _id}, newpost,function(err,post){
        if (err){
            return callback(err);
        }
        post.content = markdown.toHTML(post.content);
        callback(null,post);
    })
};

Post.remove = function(_id, callback){
    postModel.findByIdAndRemove(_id,function(err, post){
        if (err){
            return callback(err);
        }
        callback(null,post);
    })
};

Post.getcategories = function(callback){
    postModel.find().distinct("category", function(err, categories){
        if (err){
            return callback(err);
        }
        callback(null, categories);
    })
};

Post.getTen = function (callback) {
    options = {
        sort: {
            top: -1,
            time_for_sort: -1,
        },
        limit: 10
    };
    postModel.find({},null,options,function(err,posts){
            if (err){
                return callback(err);
            }
            posts.forEach(function(post){
                post.content = markdown.toHTML(post.content)
            });
            callback(null, posts);
        });
};
module.exports = Post;

