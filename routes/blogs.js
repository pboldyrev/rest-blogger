var express = require("express"),
    router  = express.Router(),
    Blog    = require("../models/blogs");

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
router.get("/new", isLoggedIn, function(req, res){
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
router.post("/", isLoggedIn, function(req, res){
  title = req.sanitize(req.body.title);
  body = req.sanitize(req.body.body);
  var newBlog = {
    title: title,
    body: body
  }

  if(req.body.url !== ""){
    newBlog["image"] = req.body.url;
  }

  Blog.create(newBlog, function(err, blog){
    if(err){
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  })
});

// Blog edit page
router.get("/:id/edit", isLoggedIn, function(req, res){
  Blog.findById(reeq.params.id, function(err, blog){
    if(err){
      console.log(err);
    } else {
      res.render("blogs/edit", {blog: blog});
    }
  });
});

// Editing a blog route
router.put("/:id", isLoggedIn, function(req, res){
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
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Delete blog route
router.delete("/:id", isLoggedIn, function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog){
    if(err){
      console.log(err);
    } else {
      res.redirect("/blogs");
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
