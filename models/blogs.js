var mongoose = require("mongoose");

// SCHEMA
var blogSchema = new mongoose.Schema({
  title: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  image: {
    type: String,
    default: "https://jdrf.org.uk/wp-content/uploads/2017/06/placeholder-image.jpg"
  },
  body: String,
  created: {
    type: Date,
    default: Date
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

module.exports = mongoose.model("Blog", blogSchema);
