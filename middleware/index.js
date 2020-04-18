var Blog    = require("../models/blogs"),
    Comment = require("../models/comments");

var middlewareObj = {};

// Check if user is authenticated for blog
middlewareObj.checkBlogOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Blog.findById(req.params.id, function(err, blog){
      if(err){
        res.redirect("back");
      } else {
        if(blog.author.id.equals(req.user._id)){
          next();
        } else {
          res.redirect("/blogs/" + req.params.id);
        }
      }
    });
  } else {
    res.redirect("/login");
  }
}

// Check if user is authenticated for blog
middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, comment){
      if(err){
        req.flash("error", "This comment does not exist.");
        res.redirect("back");
      } else {
        if(comment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash("error", "You must be the author to do that.");
          res.redirect("/blogs/" + req.params.id);
        }
      }
    });
  } else {
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
  }
}

// Check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
  }
}

module.exports = middlewareObj;
