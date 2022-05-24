const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  listens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  claps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("post", postSchema);
// mongoimport --db codechef --collection easy --jsonArray --file easy.json