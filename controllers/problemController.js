const express = require("express");
const router = express.Router();
const Easy = require("../models/problem");
const Hard = require("../models/hard");
const Question = require("../models/question");
const Tag = require("../models/tag");
const { ObjectId } = require("mongodb");

module.exports.getAllProblemsToRelatedTag = async (req, res) => {
  let { user_id, tags } = req.body;
  let offset = req.params.offset * 20;

  if (user_id === null) {
    try {
      const questions = await Question.find(
        {
          tags: { $all: tags },
        },
        { userDefinedTags: 0 }
      )
        .limit(20)
        .skip(offset);
      res.status(200).send(questions);
    } catch (err) {
      res.status(400);
      res.send(err);
    }
  } else {
    try {
      const questions = await Question.find({
        $or: [
          { tags: { $all: tags } },
          {
            $and: [
              { "userDefinedTags.tags": { $all: tags } },
              { "userDefinedTags.user_id": ObjectId(user_id) },
            ],
          },
        ],
      })
        .limit(20)
        .skip(offset);
      res.send(questions);
    } catch (err) {
      res.status(500).send({ err: "Error fetching problems" });
    }
  }
};

module.exports.tagsToProblem = async (req, res) => {
  const { problemId } = req.params;
  const { user_id } = req.body;

  if (user_id === null) {
    console.log("Here");
    let tagsObj = await Question.findOne(
      { _id: problemId },
      { _id: 0, tags: 1 }
    );
    res.status(200).send({ tags: tagsObj.tags });
  } else {
    try {
      let tagsObj = await Question.findOne(
        {
          _id: problemId,
          "userDefinedTags.user_id": { $eq: ObjectId(user_id) },
        },
        { "userDefinedTags.$": 1, _id: 0 }
      );

      if (tagsObj) {
        res.status(200).send({ tags: tagsObj.userDefinedTags[0].tags });
      } else {
        tagsObj = await Question.findOne(
          { _id: problemId },
          { _id: 0, tags: 1 }
        );
        res.status(200).send({ tags: tagsObj.tags });
      }
    } catch (err) {
      res.status(400).send({
        err: "Error fetching tags",
      });
    }
  }
};
