var mongoose = require("mongoose");

// SCHEMA
var commentSchema = new mongoose.Schema({
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  body: String,
  date: {
    type: Date,
    default: Date
  }
});

module.exports = mongoose.model("Comment", commentSchema);
