var express           = require("express"),
    override          = require("method-override"),
    request           = require("request"),
    mongoose          = require("mongoose"),
    bodyParser        = require("body-parser"),
    expressSanitizer  = require("express-sanitizer"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local"),
    Blog              = require("./models/blogs"),
    User              = require("./models/users"),
    Comment           = require("./models/comments"),
    app               = express();

mongoose.connect("mongodb+srv://"+process.argv[2] + ":" + process.argv[3] + "@udemy-rxyvm.azure.mongodb.net/blog_app", {useNewUrlParser: true, useUnifiedTopology: true});

// APP SET UP
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(override("_method"));

app.listen(3000, function(){
  console.log("Server listening on 3000");
});
//

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: process.argv[4], //not production
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.user = req.user;
  next();
});
//

// AUTH ROUTES
app.get("/register", function(req, res){
  res.render("auth/register");
});

app.post("/register", function(req, res){
  var newUser = new User({
    username: req.body.username,
    email: req.body.Email
  });

  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/blogs");
      });
    }
  });
});

app.get("/login", function(req, res){
  res.render("auth/login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/blogs",
  failureRedirect: "/login"
}), function(req, res){
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/blogs");
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login");
  }
}
//

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

app.post("/blogs", isLoggedIn, function(req, res){
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

app.get("/blogs/new", isLoggedIn, function(req, res){
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

app.get("/blogs/:id/comments/new", isLoggedIn, function(req, res){
  var id = req.params.id;

  Blog.find({_id: id}, function(err, blog){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {blog: blog});
    }
  });
});

app.post("/blogs/:id", isLoggedIn, function(req, res){
  var id = req.params.id;
  var newComment = {
    author: req.user.username,
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

app.put("/blogs/:id", isLoggedIn, function(req, res){
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

app.delete("/blogs/:id", isLoggedIn, function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog){
    if(err){
      console.log(err);
    } else {
      res.redirect("/blogs");
    }
  });
});
