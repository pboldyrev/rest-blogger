var express     = require("express"),
    router      = express.Router(),
    Blog        = require("../models/blogs"),
    Comment     = require("../models/comments"),
    middleware  = require("../middleware");

// Show all blogs
router.get("/", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
      res.render("blogs", {blogs: blogs});
    }
  });
});

// Blog create page
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("blogs/new");
});

// Show a single blog
router.get("/:id", function(req, res){
  Blog.findById(req.params.id).populate("comments").exec(function(err, blog){
    if(err){
      console.log(err);
    } else {
      res.render("blogs/blog", {blog: blog});
    }
  });
});

// Creating a blog route
router.post("/", middleware.isLoggedIn, function(req, res){

  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var title = req.sanitize(req.body.title);
  var body = req.sanitize(req.body.body);

  var newBlog = {title: title, body: body, author: author};

  if(req.body.url !== ""){
    newBlog["image"] = req.body.url;
  }

  Blog.create(newBlog, function(err, blog){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong..");
      res.send("/blogs");
    } else {
      req.flash("success", "Your blog has been created.");
      res.redirect("/blogs");
    }
  })
});

// Blog edit page
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res){
  Blog.findById(req.params.id, function(err, blog){
    res.render("blogs/edit", {blog: blog});
  });
});

// Editing a blog route
router.put("/:id", middleware.checkBlogOwnership, function(req, res){
  title = req.sanitize(req.body.title);
  body = req.sanitize(req.body.body);

  var updatedBlog = {
    title: title,
    body: body
  }

  if(req.body.url !== ""){
    updatedBlog["image"] = req.body.url;
  }

  Blog.findByIdAndUpdate(req.params.id, updatedBlog, function(err, updatedBlog){
    if(err){
      req.flash("error", "This blog does not exist.");
      res.redirect("back");
    } else {
      req.flash("success", "Your blog has been edited.");
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Delete blog route
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err, removedBlog){
    if(err){
      console.log(err);
      req.flash("error", "This blog does not exist.");
      res.redirect("/blogs")
    } else {
      Comment.deleteMany({_id: {$in: removedBlog.comments}}, function(err){
        if(err){
          console.log(err);
          req.flash("error", "Something went wrong..");
          res.redirect("/blogs");
        } else {
          req.flash("success", "Your blog has been deleted.");
          res.redirect("/blogs");
        }
      });
    }
  });
});

module.exports = router;
