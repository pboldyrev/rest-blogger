var mongoose = require("mongoose");

// SCHEMA
var commentSchema = new mongoose.Schema({
  author: String,
  body: String,
  date: {
    type: Date,
    default: Date
  }
});

module.exports = mongoose.model("Comment", commentSchema);
