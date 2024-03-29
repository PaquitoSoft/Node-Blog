var Mongoose = require('mongoose');
var Schema = Mongoose.Schema,
    ObjectId = Mongoose.ObjectId;

var UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    role: { type: String, required: true, 'default': 'user' }
});
UserSchema.statics.validate = function(login, password, callback) {
    console.log("UserSchema::validate# Validating user: " + login + " -- " + password);
    this.findOne({ email: login, 'password': password}, callback);
};
UserSchema.methods.getPosts = function(callback) {
    Post.find({ 'author': this.email }, callback);
};
var User = Mongoose.model('User', UserSchema);
console.log("User DO defined!");

var CommentSchema = new Schema({
    author: { type:String, required: true },
    postedAt: { type: Date, required: true, 'default': function() { return new Date(); } },
    content: { type: String, required: true }
});
var Comment = Mongoose.model('Comment', CommentSchema);
console.log("Comment DO defined!");

var PostSchema = new Schema({
    title: { type: String, required: true },
    postedAt: { type: Date, required: true, 'default': function() { return new Date(); } },
    content: { type: String, required: true },
    author: { type: String, required: true },
    comments: [CommentSchema], 
    tags: [String] 
});
PostSchema.statics.byAuthor = function(authorLogin, callback) {
    console.log("PostSchema::byAuthor# Author: " + authorLogin);
    this.find({ author: authorLogin }, [], { desc: 'postedAt' }, callback);
};
PostSchema.statics.findAllTags = function(callback) {
    console.log("PostSchema::findAllTags# entering...");    
    this.find({}, ['tags'], function(err, tags) {
            if (err) return callback(err);
            var result = [];
            for (var i = 0; i < tags.length; i++) {
                result = result.concat(tags[i].tags);
            }
            callback(null, result);
    });
};
var Post = Mongoose.model('Post', PostSchema);
console.log("Post DO defined!");


exports.User = User;
exports.Comment = Comment;
exports.Post = Post;