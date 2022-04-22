const router = require("express").Router();
const Thought = require("../../models/Thought");
const User = require("../../models/User");

//Get All

router.get("/", async (req, res) => {
  try {
    const getThought = await Thought.find().select("-__v");
    res.status(200).json(getThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get by ID

router.get("/:id", async (req, res) => {
  try {
    const getOneThought = await Thought.findOne().select("-__v");
    res.status(200).json(getOneThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Post

router.post("/", async (req, res) => {
  try {
    const createThought = await Thought.create(req.body);
    const addThoughtToUser = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: createThought } },
      {
        new: true,
      }
    );

    res.status(200).json(addThoughtToUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Put by ID

router.put("/:id", async (req, res) => {
  try {
    const updateThought = await Thought.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      {
        new: true,
      }
    ).select("-__v");
    res.status(200).json(updateThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete by ID

router.delete("/:id", async (req, res) => {
  try {
    const deleteThought = await Thought.findOneAndDelete({
      _id: req.params.id,
    }).select("-__v");
    res.status(200).json(deleteThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Post Reaction

router.post("/:thoughtId/reaction", async (req, res) => {
  try {
    const addReactionToThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      {
        new: true,
      }
    ).select("-__v");

    res.status(200).json(addReactionToThought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Delete Reaction

router.delete("/:thoughtId/:reactionId", async (req, res) => {
  try {
    const addReactionToThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      {
        new: true,
      }
    ).select("-__v");

    res.status(200).json(addReactionToThought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
