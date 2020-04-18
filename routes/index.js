var express   = require("express"),
    router    = express.Router(),
    passport  = require("passport"),
    Blog      = require("../models/blogs"),
    User      = require("../models/users");

// Root route
router.get("/", function(req, res){
  res.redirect("blogs");
});

// Register page
router.get("/register", function(req, res){
  res.render("auth/register");
});

// Register route
router.post("/register", function(req, res){
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

// Login page
router.get("/login", function(req, res){
  res.render("auth/login");
});

// Login route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/blogs",
  failureRedirect: "/login"
}), function(req, res){
});

// Log out route
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/blogs");
})

// Check if user is logged in
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
