/**
 * Created by tianhengzhou on 8/18/15.
 */
var db = require('./db'),
    markdown = require('markdown').markdown;
var postSchema = new db.Schema({
    name: String,
    title: String,
    content: String,
    time: String
});
var postModel = db.model('Post',postSchema);

function Post(name,title,content){
    this.name = name;
    this.title = title;
    this.content = content;
}

Post.prototype.save = function(callback){
    var date = new Date();
    var time = date.toString();
    var post = {
        name: this.name,
        title: this.title,
        content: this.content,
        time: time
    };
    var newPost = new postModel(post);

    newPost.save(function(err,post){
        if (err){
            return callback(err);
        }
        callback(null, post);
    })
};
Post.get = function (name, callback) {
    options = {sort: {time: -1}};
    if (!name){
        postModel.find({},null,options,function(err,posts){
            if (err){
                return callback(err);
            }
            console.log(typeof posts)
            posts.forEach(function(post){
                post.content = markdown.toHTML(post.content)
            });
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

module.exports = Post;

