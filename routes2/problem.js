const express = require("express");
const router = express.Router();
const Easy = require("../models/problem");
const Hard = require("../models/hard");
const Question = require("../models/question");
const Tag = require("../models/tag");
const { requireAuth } = require("../controllers/authController");
const {
  getAllProblemsToRelatedTag,
  tagsToProblem,
} = require("../controllers/problemController");

router.get("/", async (req, res) => {
  const user = await Hard.find();
  res.send(user);
});

router.post("/", async (req, res) => {
  Question.create(req.body, function (err, newProblem) {
    if (err) console.log(err);
    else {
      res.send(newProblem);
    }
  });
});

router.post("/hard", async (req, res) => {
  console.log(req.body);

  Question.create(req.body, function (err, newProblem) {
    if (err) console.log(err);
    else {
      res.send(newProblem);
    }
  });
});

// Get all problems Related to a tag(need to be changed for user defined tags)
router.post("/:offset", getAllProblemsToRelatedTag);

// Get all user defined tags to a given problem for a user
router.post("/problem/:problemId/", tagsToProblem);

module.exports = router;
