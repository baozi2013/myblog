/**
 * Created by tianhengzhou on 8/18/15.
 */
var db = require('./db');
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
    if (!name){
        postModel.find({},function(err,post){
            if (err){
                return callback(err);
            }
            callback(null, post);
        });
    }
    else {
        postModel.find({name: name}, function (err, post) {
            if (err) {
                return callback(err);
            }
            callback(null, post);
        });
    }
};

module.exports = Post;

