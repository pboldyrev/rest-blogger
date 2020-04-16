var express     = require("express"),
    request     = require("request"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser");

var app = express();

mongoose.connect("mongodb+srv://xx:xx@udemy-rxyvm.azure.mongodb.net/blog_app", {useNewUrlParser: true, useUnifiedTopology: true});

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String
});

var Blog = mongoose.model("Blog", blogSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.listen(3000, function(){
  console.log("Server listening on 3000");
});

app.get("/", function(req, res){
  res.render("blogs");
});
