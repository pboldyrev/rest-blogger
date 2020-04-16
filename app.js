var express           = require("express"),
    override          = require("method-override"),
    request           = require("request"),
    mongoose          = require("mongoose"),
    bodyParser        = require("body-parser"),
    expressSanitizer  = require("express-sanitizer"),
    Blog              = require("./models/blogs"),
    User              = require("./models/users"),
    Comment           = require("./models/comments"),
    app               = express();

mongoose.connect("mongodb+srv://"+process.argv[2] + ":" + process.argv[3] + "@udemy-rxyvm.azure.mongodb.net/blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(override("_method"));

app.listen(3000, function(){
  console.log("Server listening on 3000");
});

app.get("/", function(req, res){
  res.redirect("blogs");
});

app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
      res.render("blogs", {blogs: blogs});
    }
  });
});

app.post("/blogs", function(req, res){
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

app.get("/blogs/new", function(req, res){
  res.render("blogs/new");
});

app.get("/blogs/:id/edit", function(req, res){
  var id = req.params.id;

  Blog.find({_id: id}, function(err, blog){
    if(err){
      console.log(err);
    } else {
      res.render("blogs/edit", {blog: blog});
    }
  });
});

app.get("/blogs/:id/comments/new", function(req, res){
  var id = req.params.id;

  Blog.find({_id: id}, function(err, blog){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {blog: blog});
    }
  });
});

app.post("/blogs/:id", function(req, res){
  var id = req.params.id;
  var newComment = {
    author: req.body.author,
    body: req.body.body
  }

  Blog.find({_id: id}).populate("comments").exec(function(err, blog){
    if(err){
      console.log(err);
    } else {
      Comment.create(newComment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          blog[0].comments.push(comment);
          blog[0].save();
          res.redirect("/blogs/" + id);
        }
      });
    }
  });
});

app.get("/blogs/:id", function(req, res){
  Blog.find({_id: req.params.id}).populate("comments").exec(function(err, blog){
    if(err){
      console.log(err);
    } else {
      res.render("blogs/blog", {blog: blog});
    }
  });
});

app.put("/blogs/:id", function(req, res){
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

app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog){
    if(err){
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});
