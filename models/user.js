const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const RequestError = require("../errorTypes/RequestError");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address.");
      }
    },
  },
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    minlength: 8,
  },
  tags: {
    type: Array,
    required: true,
  },
});

UserSchema.pre("save", function (next) {
  const saltRounds = 10;
  // Check if the password has been modified
  if (this.modifiedPaths().includes("password")) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const document = await User.findOne({
        $or: [{ email: this.email }, { username: this.username }],
      });
      if (document)
        return next(
          new RequestError(
            "A user with that email or username already exists.",
            400
          )
        );
    } catch (err) {
      return next((err.statusCode = 400));
    }
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
