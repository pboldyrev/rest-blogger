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
  });

  User.register(newUser, req.body.password, function(err, user){
    if(err){
      console.log(err);
      req.flash("error", err.message);
      res.render("auth/register");
    } else {
        passport.authenticate("local")(req, res, function(){
          req.flash("success", "You have been registered. Welcome, " + user.username + "!");
          res.redirect("/blogs");
      });
    }
  });
});

// Login page
router.get("/login", function(req, res){
  res.render("./auth/login");
});

// Login route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/blogs",
  failureRedirect: "/login",
  failureFlash: true
}), function(req, res){
});

// Log out route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You were successfully logged out!");
  res.redirect("/blogs");
});

module.exports = router;
