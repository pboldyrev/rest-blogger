var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Blog    = require("../models/blogs"),
    Comment = require("../models/comments"),
    middleware  = require("../middleware");

// Adding a comment page
router.get("/new", middleware.isLoggedIn, function(req, res){
  Blog.findById(req.params.id, function(err, blog){
    if(err){
      console.log(err);
      req.flash("error", "This blog does not exist.");
      res.redirect("./blogs");
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
      req.flash("error", "This comment does not exist.");
      res.redirect("./blogs");
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
      req.flash("error", "This comment does not exist.");
      res.redirect("/blogs/" + req.params.id);
    } else {
      req.flash("success", "The comment has been updated.");
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Removing a comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, comment){
    if(err){
      console.log(err);
      req.flash("error", "This comment does not exist.");
      res.redirect("/blogs/" + req.params.id);
    } else {
      comment.remove();
      req.flash("success", "The comment has been deleted.");
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Adding a comment route
router.post("/", middleware.isLoggedIn, function(req, res){
  Blog.findById(req.params.id).populate("comments").exec(function(err, blog){
    if(err){
      console.log(err);
      req.flash("error", "This blog does not exist.");
      res.redirect("/blogs");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
          req.flash("error", "Something went wrong..");
          res.redirect("/blogs/" + blog._id);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.body = req.sanitize(req.body.body);
          comment.save();
          blog.comments.push(comment);
          blog.save();

          req.flash("success", "Your comment has been posted.");
          res.redirect("/blogs/" + blog._id);
        }
      });
    }
  });
});

module.exports = router;
