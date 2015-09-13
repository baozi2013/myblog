/**
 * Created by tianhengzhou on 8/18/15.
 */
var db = require('./db');

var postSchema = new db.Schema({
    name: String,
    title: String,
    content: String,
    time: String,
    time_for_sort: Number,
    top: Number,
    category: String,
    pv: Number
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
    var m_names = new Array("January", "February", "March",
        "April", "May", "June", "July", "August", "September",
        "October", "November", "December");
    var curr_date = date.getDate(),
        curr_month = date.getMonth(),
        curr_year = date.getFullYear();
    var time = curr_date + ' ' + m_names[curr_month] + ' '+ curr_year;
    var time_for_sort = Date.now();
    var post = {
        name: this.name,
        title: this.title,
        content: this.content,
        time: time,
        time_for_sort: time_for_sort,
        top: this.top,
        comments: [],
        category: this.category,
        pv: 0
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
            callback(null, posts);
        });
    }
};

Post.getOne = function(_id, callback){
    postModel.findOneAndUpdate({_id: _id}, {$inc: {pv: 1}}, function(err,post){
        if (err){
            return callback(err);
        }
        callback(null,post);
    })
};
Post.getOnecategory = function(category, callback){
    postModel.find({category: category}, function(err,post){
        if (err){
            return callback(err);
        }
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
    var m_names = new Array("January", "February", "March",
        "April", "May", "June", "July", "August", "September",
        "October", "November", "December");
    var curr_date = date.getDate(),
        curr_month = date.getMonth(),
        curr_year = date.getFullYear();
    var time = curr_date + ' ' + m_names[curr_month] + ' '+ curr_year;
    newpost.time = time;
    newpost.time_for_sort = Date.now();
    postModel.findOneAndUpdate({_id: _id}, newpost,function(err,post){
        if (err){
            return callback(err);
        }
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
        limit: 5
    };
    postModel.find({},null,options,function(err,posts){
            if (err){
                return callback(err);
            }
            callback(null, posts);
        });
};
module.exports = Post;

