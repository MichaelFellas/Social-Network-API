const router = require("express").Router();
const Thought = require("../../models/Thought");
const User = require("../../models/User");

//Get All Users

router.get("/", async (req, res) => {
  try {
    const getUser = await User.find().select("-__v");
    res.status(200).json(getUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get User by ID

router.get("/:id", async (req, res) => {
  try {
    const getOneUser = await User.findOne({
      _id: req.params.id,
    })
      .select("-__v")
      .populate("friends")
      .populate("thoughts");
    res.status(200).json(getOneUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Post new User

router.post("/", async (req, res) => {
  try {
    const createUser = await User.create(req.body);
    res.status(200).json(createUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Put User by ID

router.put("/:id", async (req, res) => {
  try {
    const updateUser = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      {
        new: true,
      }
    ).select("-__v");
    res.status(200).json(updateUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete User by ID

router.delete("/:id", async (req, res) => {
  try {
    const deleteUser = await User.findOneAndDelete({
      _id: req.params.id,
    });
    //Delete's thoughts matching username
    const deleteThoughts = await Thought.deleteMany({
      username: deleteUser.username,
    }).select("-__v");
    res.status(200).json(deleteUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Post Add friend
//Adds friends to both users

router.post("/:id/friends/:friendId", async (req, res) => {
  try {
    const addFriend = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $addToSet: { friends: req.params.friendId } },
      {
        new: true,
      }
    );
    const addFriend2 = await User.findOneAndUpdate(
      {
        _id: req.params.friendId,
      },
      { $addToSet: { friends: req.params.id } },
      {
        new: true,
      }
    ).select("-__v");
    res.status(200).json(addFriend);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete Friend
//Deletes friends from both users

router.delete("/:id/friends/:friendId", async (req, res) => {
  try {
    const deleteFriend = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $pull: { friends: req.params.friendId } },
      {
        new: true,
      }
    );
    const deleteFriend2 = await User.findOneAndUpdate(
      {
        _id: req.params.friendId,
      },
      { $pull: { friends: req.params.id } },
      {
        new: true,
      }
    ).select("-__v");
    res.status(200).json(deleteFriend);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
