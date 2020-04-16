var mongoose = require("mongoose");

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
    default: Date
  }
});

module.exports = mongoose.model("Blog", blogSchema);
