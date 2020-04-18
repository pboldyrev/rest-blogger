var express           = require("express"),
    override          = require("method-override"),
    request           = require("request"),
    mongoose          = require("mongoose"),
    bodyParser        = require("body-parser"),
    expressSanitizer  = require("express-sanitizer"),
    passport          = require("passport"),
    flash             = require("connect-flash"),
    LocalStrategy     = require("passport-local"),
    Blog              = require("./models/blogs"),
    User              = require("./models/users"),
    Comment           = require("./models/comments"),
    app               = express();

var indexRoutes       = require("./routes/index"),
    blogRoutes        = require("./routes/blogs"),
    commentRoutes     = require("./routes/comments");

mongoose.connect("mongodb+srv://admin:pass@udemy-rxyvm.azure.mongodb.net/blog_app", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// APP SET UP
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(override("_method"));
app.use(flash());

app.listen(3000, function(){
  console.log("Server listening on 3000");
});
//

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "1234567890",
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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
//

// ROUTING CONFIGURATION
app.use(indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments",commentRoutes);
//
