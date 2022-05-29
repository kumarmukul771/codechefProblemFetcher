const mongoose = require("mongoose");

const ProblemSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  challengeType: {
    type: String,
    // required: true,
  },
  dateAdded: {
    type: String,
    // required: true,
  },
  languagesSupported: {
    type: Array,
    // required: true,
  },
  maxTimeLimit: {
    type: String,
    // required: true,
  },
  problemCode: {
    type: String,
    // required: true,
    unique: true,
  },
  partialSubmissions: {
    type: String,
    // required: true,
  },
  sourceSizeLimit: {
    type: String,
    // required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  userDefinedTags: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      tags: {
        type: Array,
        required: true,
      },
    },
  ],
  totalSubmissions: {
    type: String,
    // required: true,
  },
  problemName: {
    type: String,
    required: true,
  },
  successfulSubmissions: {
    type: String,
    // required: true,
  },
  accuracy: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("problem", ProblemSchema);
