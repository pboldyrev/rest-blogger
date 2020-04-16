var express     = require("express"),
    request     = require("request"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    app         = express();

mongoose.connect("mongodb+srv://xx:xx@udemy-rxyvm.azure.mongodb.net/blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// SCHEMA
var blogSchema = new mongoose.Schema({
  title: String,
  image: {
    type: String,
    default: "https://jdrf.org.uk/wp-content/uploads/2017/06/placeholder-image.jpg"
  },
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

// MODEL
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Great Weather",
//   body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
//   image: "https://images.unsplash.com/photo-1465577512280-1c2d41a79862?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1930&q=80"
// }, function(err, blog){
//   if(err){
//     console.log("An error has occured!");
//   } else {
//     console.log(blog);
//   }
// });

app.listen(3000, function(){
  console.log("Server listening on 3000");
});

app.get("/", function(req, res){
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    } else {
      res.render("blogs", {blogs: blogs});
    };
  });
});

app.post("/blogs", function(req, res){
  var newBlog = {
    title: req.body.title,
    body: req.body.body,
  };

  if(req.body.url !== ""){
    newBlog["image"] = req.body.url;
  };

  Blog.create(newBlog, function(err, blog){
    if(err){
      console.log(err);
    } else {
      console.log(blog);
      res.redirect("/blogs");
    };
  })
});

app.get("/blogs/new", function(req, res){
  res.render("new");
});

app.get("/blogs/:id", function(req, res){
  Blog.find({_id: req.params.id}, function(err, blog){
    if(err){
      console.log(err);
    } else {
      console.log(blog);
      res.render("blog", {blog: blog});
    };
  });
});
