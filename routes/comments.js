var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Blog    = require("../models/blogs"),
    middleware  = require("../middleware"),
    Comment = require("../models/comments");

// Adding a comment page
router.get("/new", middleware.isLoggedIn, function(req, res){
  Blog.findById(req.params.id, function(err, blog){
    if(err){
      console.log(err);
    } else {
      res.render("./comments/new", {blog: blog});
    }
  });
});

// Editing a comment page
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, comment){
    if(err){
      console.log(err);
    } else {
      res.render("./comments/edit", {comment: comment, blog_id: req.params.id});
    }
  });
});

// Editing a comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  newComment = {
    author: {
      id: req.user.id,
      username: req.user.username
    },
    body: req.sanitize(req.body.body)
  }

  Comment.findByIdAndUpdate(req.params.comment_id, newComment, function(err, comment){
    if(err){
      console.log(err);
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Removing a comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, comment){
    if(err){
      console.log(err);
    } else {
      comment.remove();
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Adding a comment route
router.post("/", middleware.isLoggedIn, function(req, res){
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

module.exports = router;
