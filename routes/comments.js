var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Blog    = require("../models/blogs"),
    Comment = require("../models/comments");

// Adding a comment page
router.get("/comments/new", isLoggedIn, function(req, res){
  Blog.findById(req.params.id, function(err, blog){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {blog: blog});
    }
  });
});

// Adding a comment route
router.post("/", isLoggedIn, function(req, res){
  Blog.findById(req.params.id).populate("comments").exec(function(err, blog){
    if(err){
      console.log(err);
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.body = req.body.body;
          comment.save();

          blog.comments.push(comment);
          blog.save();
          res.redirect("/blogs/" + blog._id);
        }
      });
    }
  });
});

// Check if user is logged in
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
