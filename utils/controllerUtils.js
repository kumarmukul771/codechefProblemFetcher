const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const linkify = require('linkifyjs');
require('linkifyjs/plugins/mention')(linkify);
const fs = require('fs');

/**
 * Generates a unique username based on the base username
 * @function generateUniqueUsername
 * @param {string} baseUsername The first part of the username to add a random number to
 * @returns {string} Unique username
 */
module.exports.generateUniqueUsername = async (baseUsername) => {
  let uniqueUsername = undefined;
  try {
    while (!uniqueUsername) {
      const username = baseUsername + Math.floor(Math.random(1000) * 9999 + 1);
      const user = await User.findOne({ username });
      if (!user) {
        uniqueUsername = username;
      }
    }
    return uniqueUsername;
  } catch (err) {
    throw new Error(err.message);
  }
};
