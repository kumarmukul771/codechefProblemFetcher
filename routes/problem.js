const express = require("express");
const question = require("../models/question");
const router = express.Router();
const Question = require("../models/question");
const tag = require("../models/tag");
const Tag = require("../models/tag");
// const User = require("../models/user")

// Get all problems Related to a tag(need to be changed for user defined tags)
router.post("/", async (req, res) => {

    let {author, concept, userDefined} = req.body;
    const userId = "5fbea60fb1160b2be07711ca"
    // const userId = null
    // userDefined = ["webdev"]

    if (typeof(author) === "string") {
        author = [author];
    }
    if (typeof(concept) === "string") {
        concept = [concept];
    }
    if (typeof(userDefined) === "string") {
        userDefined = [userDefined]
    }

    if (typeof(author) === "undefined") {
        author = []
    }
    if (typeof(concept) === "undefined") {
        concept = []
    }
    if (typeof(userDefined) === "undefined") {
        userDefined = []
    }

    let tags = [
        ...author,
        ...concept,
        ...userDefined
    ]

    console.log(tags);
    if (userId === null) {
        try {
            const questions = await Question.find({
                tags: {
                    $all: tags
                }
            }, {userDefinedTags: 0});

            res.render("allproblem", {data: questions});
        } catch (err) {
            res.status(400);
            res.send(err);
        }
    } else {
        try {
            const questions = await Question.find({
                $or: [
                    {
                        tags: {
                            $all: tags
                        }
                    }, {
                        $and: [
                            {
                                "userDefinedTags.tags": {
                                    $all: tags
                                }
                            }, {
                                "userDefinedTags.user_id": userId
                            },
                        ]
                    },
                ]
            });
            res.render("allproblem", {data: questions})
        } catch (err) {
            res.status(500).send({err: "Error fetching problems"});
        }
    }


});

// Add user defined tag to a problem
router.post("/addNewTag/:problemId", async (req, res, next) => {
    const userId = "5fbea60fb1160b2be07711ca";
    const problemId = req.params.problemId;
    const {newTag} = req.body;

    try {
        let foundActualTag = await Tag.findOne({tag: newTag});

        let updateUserTags = null;

        // To show on homepage user defined tags
        // if (! foundActualTag) { // Add tag to user model
        //     updateUserTags = await User.findById({
        //         _id: userId
        //     })
        //     // , {
        //     //     $addToSet: {
        //     //         tags: newTag
        //     //     }
        //     // });
        // }

        let problemTags = await Question.findById(problemId, {
            _id: 0,
            tags: 1
        });
        console.log("problme tags", problemTags);

        let updateProblem = await Question.findOneAndUpdate({
            _id: problemId,
            "userDefinedTags.user_id": {
                $eq: userId
            }
        }, {
            $addToSet: {
                "userDefinedTags.$.tags": newTag
            }
        });

        if (updateProblem === null) {
            updateProblem = await Question.findByIdAndUpdate(problemId, {
                $push: {
                    userDefinedTags: {
                        user_id: userId,
                        tags: [
                            newTag,
                            ... problemTags.tags
                        ]
                    }
                }
            }, {
                userDefinedTags: 1,
                _id: 0
            });
        }

        res.send("hii");

        // updateProblem = await Question.findOne({
        //     _id: problemId,
        //     "userDefinedTags.user_id": {
        //         $eq: userId
        //     }
        // }, {
        //     _id: 0,
        //     userDefinedTags: 1
        // });

        // res.send({updateUserTags, updateProblem});
    } catch (err) {
        console.log(err);
        res.status(400);
        res.send({err: "Trouble adding tag."});
    }
})

router.get("/problem", (req, res) => {
    res.render("newProblem.ejs")
})

router.post("/problem/", async (req, res) => {
    const problemName = req.body.problemName
    const tags = req.body.tags.split(" ");

    console.log(problemName, tags)

    // res.send("Hii")

    const data = await question.create({author: "aaaaaaaaaa", problemName: problemName, tags: tags});

    const foundTag = await tag.find({tag: "aaaaaaaaaa", type: "author"}); 

    console.log(foundTag, "Here")

    if (! foundTag.length) {
        const newTag = await tag.create({tag: "aaaaaaaaaa", type: "author"})
    }

    res.send(data)
});

module.exports = router;
