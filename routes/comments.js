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
  var id = req.params.id;
  var newComment = {
    author: req.user.username,
    body: req.body.body
  }

  Blog.findById(id).populate("comments").exec(function(err, blog){
    if(err){
      console.log(err);
    } else {
      Comment.create(newComment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          blog.comments.push(comment);
          blog.save();
          res.redirect("/blogs/" + id);
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
