const mongoose = require("mongoose");

const EasySchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  problemCode: {
    type: String,
    required: true,
    unique: true,
  },
  problemName: {
    type: String,
    required: true,
  },
  successfulSubmissions: {
    type: String,
    required: true,
},
  accuracy: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("medium", EasySchema);