const jwt = require("jwt-simple");
const crypto = require("crypto");
const User = require("../models/User");
const ConfirmationToken = require("../models/ConfirmationToken");
const bcrypt = require("bcrypt");
const axios = require("axios");

const {
  validateEmail,
  validateFullName,
  validatePassword,
} = require("../utils/validation");

module.exports.verifyJwt = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = jwt.decode(token, process.env.JWT_SECRET).id;
      const user = await User.findOne({ _id: id });
      if (user) {
        return resolve(user);
      } else {
        reject("Not authorized.");
      }
    } catch (err) {
      return reject("Not authorized.");
    }
  });
};

module.exports.requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send({ error: "Not authorized." });
  try {
    const user = await this.verifyJwt(authorization);
    // Allow other middlewares to access the authenticated user details.
    res.locals.user = user;
    return next();
  } catch (err) {
    return res.status(401).send({ error: err });
  }
};

module.exports.optionalAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const user = await this.verifyJwt(authorization);
      // Allow other middlewares to access the authenticated user details.
      res.locals.user = user;
    } catch (err) {
      return res.status(401).send({ error: err });
    }
  }
  return next();
};

module.exports.loginAuthentication = async (req, res, next) => {
  const { authorization } = req.headers;
  const { usernameOrEmail, password } = req.body;
  if (authorization) {
    try {
      const user = await this.verifyJwt(authorization);
      return res.send({ 
        user,
        token: authorization,
      });
    } catch (err) {
      return res.status(401).send({ error: err });
    }
  }

  if (!usernameOrEmail || !password) {
    return res
      .status(400)
      .send({ error: "Please provide both a username/email and a password." });
  }

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user || !user.password) {
      return res.status(401).send({
        error: "The credentials you provided are incorrect, please try again.",
      });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return next(err);
      }
      if (!result) {
        return res.status(401).send({
          error:
            "The credentials you provided are incorrect, please try again.",
        });
      }

      res.send({
        user: {
          _id: user._id,
          email: user.email,
          username: user.username
        },
        token: jwt.encode({ id: user._id }, process.env.JWT_SECRET),
      });
    });
  } catch (err) {
    next(err);
  }
};

module.exports.register = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  let user = null;
  let confirmationToken = null;

  let resArr = fullName.split(" ");

  const username = resArr.join(".") + Math.random().toString(36).substr(2, 9);

  const fullNameError = validateFullName(fullName);
  if (fullNameError) return res.status(400).send({ error: fullNameError });

  const emailError = validateEmail(email);
  if (emailError) return res.status(400).send({ error: emailError });

  const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).send({ error: passwordError });

  try {
    user = new User({ username, fullName, email, password, tags: [] });
    confirmationToken = new ConfirmationToken({
      user: user._id,
      token: crypto.randomBytes(20).toString("hex"),
    });
    await user.save();

    await confirmationToken.save();
    res.status(201).send({
      user: {
        email: user.email,
        username: user.username,
        _id: user._id
      },
      token: jwt.encode({ id: user._id }, process.env.JWT_SECRET),
    });
  } catch (err) {
    next(err);
  }
};
