const express = require("express");
const Tag = require("../models/tag");
const User = require("../models/User");
const router = express.Router();


// Get all tags with user defined tags if user is logged in
router.get("/", async (req, res, next) => {
    try {
        const actualTags = await Tag.find({
            type: "actual_tag"
        }, {
            _id: 0,
            tag: 1
        });

        const authorTags = await Tag.find({
            type: "author"
        }, {
            tag: 1,
            _id: 0
        })

        // Get all user defined tags for a given user
        const userId = "5fbea60fb1160b2be07711ca";
        let userDefinedTags = null;
        const data = await User.findById(userId, {
            tags: 1,
            _id: 0
        });


        if(data){
            userDefinedTags = data.tags
        }

        res.render("home", {authorTags, actualTags, userDefinedTags});
    } catch (err) {
        res.status(500);
        res.send({err: "Server error"});
        next(err);
    }
});

// Get all user defined tags for a given user
// router.get("/userDefinedTags", async (req, res) => {});

module.exports = router;
