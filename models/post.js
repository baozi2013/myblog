/**
 * Created by tianhengzhou on 8/18/15.
 */
var db = require('./db');
var postSchema = new db.Schema({
    name: String,
    title: String,
    post: String,
    time: String
});
var postModel = db.model('Post',postSchema);

function Post(name,title,post){
    this.name = name;
    this.title = title;
    this.post = post;
}

Post.prototype.save = function(callback){
    var date = new Date();
    var time = date.toUTCString();
    var post = {
        name: this.name,
        title: this.title,
        post: this.post,
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

}

