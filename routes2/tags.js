const express = require("express");
const router = express.Router();
const { requireAuth } = require("../controllers/authController");
const {
  getAllTags,
  getAllTagsOfType,
  addUserDefinedTag,
  searchTag,
  getUserDefinedTags,
} = require("../controllers/tagController");

// Add user defined tag
router.post("/", requireAuth, addUserDefinedTag);
 
// Search for tags in both tags and user tags collection.
router.post("/search_tag/", searchTag);

// Get all tags except user defined tags
router.get("/allTags", getAllTags);

// Get all tags of given type(actual_tag,author)
router.get("/tags/:tagType/:offset", getAllTagsOfType);

// Get all user defined tags for a given user
router.get("/userDefinedTags", requireAuth, getUserDefinedTags);

module.exports = router;