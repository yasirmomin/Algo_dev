const User = require('../models/User');
const mongoose = require("mongoose");

const searchUsers = async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: "Username query is required" });
  }

  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" }
    }).select("_id username firstName lastName profilePic");

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addFriend = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.id;

  if (!friendId || !mongoose.Types.ObjectId.isValid(friendId)) {
    return res.status(400).json({ message: "Invalid friend ID" });
  }

  if (userId === friendId) {
    return res.status(400).json({ message: "You cannot add yourself" });
  }

  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already your friend" });
    }

    user.friends.push(friendId);
    await user.save();

    return res.status(200).json({ message: "Friend added successfully" });
  } catch (err) {
    console.error("Add friend error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id firstName lastName email username profilePic rating friends contestsGiven problemsSolved createdAt phone isAdmin"
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id username firstName lastName email profilePic rating friends contestsGiven problemsSolved"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "_id username profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ friends: user.friends });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeFriend = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.id;

  if (userId === friendId) {
    return res.status(400).json({ message: "You cannot remove yourself." });
  }

  try {
    const user = await User.findById(userId);

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "This user is not in your friends list." });
    }

    user.friends = user.friends.filter(f => f.toString() !== friendId);
    await user.save();

    res.status(200).json({ message: "Friend removed successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { searchUsers , addFriend ,getMyProfile, getUserById , getFriends, removeFriend };
