var mongoose = require("mongoose");

// SCHEMA
var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  blogs: [{
    title: String,
    body: String,
    image: String
  }]
});

module.exports = mongoose.model("User", userSchema);
