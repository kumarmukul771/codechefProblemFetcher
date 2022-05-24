const express = require("express");
const router = express.Router();
const UserDefinedTag = require("../models/userDefinedTag");
const Tag = require("../models/tag");
const {requireAuth} = require("../controllers/authController");
const Question = require("../models/question");
const User = require("../models/User");
const {ObjectID} = require("mongodb");

module.exports.getAllTags = async (req, res, next) => {
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

        console.log(authorTags);

        res.render("home", {authorTags, actualTags});
    } catch (err) {
        res.status(500);
        res.send({err: "Server error"});
        next(err);
    }
};

module.exports.getAllTagsOfType = async (req, res, next) => {
    let tagType = req.params.tagType;
    let offset = req.params.offset * 10;

    try {
        const resp = await Tag.find({
            type: tagType
        }, {
            tag: 1,
            _id: 0
        }).sort({count: -1}).limit(10).skip(offset);

        if (resp.length === 0) {
            res.status(400);
            res.send({data: "No tags found"});
        } else {
            res.send(resp);
        }
    } catch (err) {
        console.log("HERE");
        res.status(400);
        let error = {
            error: "Could not load tags."
        };
        res.send(error);
    }
};

module.exports.addUserDefinedTag = async (req, res, next) => {
    const user = res.locals.user;
    const {problemId, tagName} = req.body;

    try {
        let foundActualTag = await Tag.findOne({tag: tagName});

        let updateUserTags = null;

        if (! foundActualTag) { // Add tag to user model
            updateUserTags = await User.findOneAndUpdate({
                _id: user._id
            }, {
                $addToSet: {
                    tags: tagName
                }
            });
        }

        let problemTags = await Question.findById(problemId, {
            _id: 0,
            tags: 1
        });
        console.log("problme tags", problemTags);

        let updateProblem = await Question.findOneAndUpdate({
            _id: problemId,
            "userDefinedTags.user_id": {
                $eq: user._id
            }
        }, {
            $addToSet: {
                "userDefinedTags.$.tags": tagName
            }
        });

        if (updateProblem === null) {
            updateProblem = await Question.findByIdAndUpdate(problemId, {
                $push: {
                    userDefinedTags: {
                        user_id: user._id,
                        tags: [
                            tagName,
                            ... problemTags.tags
                        ]
                    }
                }
            }, {
                userDefinedTags: 1,
                _id: 0
            });
        }

        updateProblem = await Question.findOne({
            _id: problemId,
            "userDefinedTags.user_id": {
                $eq: user._id
            }
        }, {
            _id: 0,
            userDefinedTags: 1
        });

        res.send({updateUserTags, updateProblem});
    } catch (err) {
        console.log(err);
        res.status(400);
        res.send({err: "Trouble adding tag."});
    }
};

module.exports.searchTag = async ({
    body: {
        currentUser,
        value
    }
}, res) => {
    let data = [],
        userData = [];

    const {user_id} = currentUser;

    try {
        if (value === undefined) {
            // data = await Tag.find({}, { _id: 0, tag: 1 }).limit(10);
            // continue;
        } else {
            data = await Tag.find({
                tag: {
                    $regex: value,
                    $options: "$i"
                }
            }, {
                _id: 0,
                tag: 1
            }).limit(10);
        }

        if (user_id !== null) {
            if (value === undefined) { // continue;
            } else {
                console.log(user_id);
                userData = await User.aggregate([
                    {
                        $unwind: {
                            path: "$tags"
                        }
                    }, {
                        $match: {
                            $and: [
                                {
                                    _id: ObjectID(user_id)
                                }, {
                                    tags: {
                                        $regex: value
                                    }
                                }
                            ]
                        }
                    }, {
                        $group: {
                            _id: {
                                tags: "$tags"
                            }
                        }
                    },
                ]).limit(10);
            }
        }

        return res.status(200).json({data, userData});
    } catch (error) {
        return res.status(500).json({error: "Error fetching tags"});
    }
};

module.exports.getUserDefinedTags = async (req, res) => {
    const user = res.locals.user;

    try {
        const userTags = await User.findById(user._id, {tags: 1});
        console.log(userTags);

        res.status(200).send({tags: userTags.tags});
    } catch (err) {
        res.status(500).send({err: "Error fetching user defined tags"});
    }
};
