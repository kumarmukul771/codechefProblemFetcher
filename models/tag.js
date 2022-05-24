const mongoose = require("mongoose");

const TagSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  tag: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("tag", TagSchema);

// TASK 
// Tags are of two types 
// actual_tag
// author 

// In home page there will be 2 sections Concept and author
// In author section show author tags and vice versa 
// Tags should be selectable 
// A submit button (On submitting show an alert box that these tags are selected)