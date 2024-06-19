import User from "../models/userSchema.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import helper from "../helper/helper.js";
import mongoose from "mongoose";

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const photo = req.file ? req.file.filename : null;
  try {
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    const photoUrl = photo ? `/public/images/${photo.filename}` : null;
    const userData = await User.create({
      firstName,
      lastName,
      email,
      password: newPassword,
      photo: photoUrl,
    });

    const auth_token = helper.generateToken(userData);

    return res
      .status(201)
      .json({ message: "User registered successfully", auth_token });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const userData = user.toJSON();
    const auth_token = helper.generateToken(userData);
    return res
      .status(200)
      .json({ message: "User logged in successfully", auth_token });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const fetchUser = async (req, res) => {
  try {
    let userId = req.user._id;
    if (req.params.id) userId = req.params.id;
    const user = await User.findById(userId).select({ password: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const aggregateData = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "user_id",
          pipeline: [
            {
              $match: { user_id: new mongoose.Types.ObjectId(userId) },
            },
            {
              $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post_id",
                as: "likes",
              },
            },
            {
              $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "post_id",
                as: "comments",
              },
            },

            {
              $project: {
                title: 1,
                content: 1,
                user_id: 1,
                cretedAt: 1,
                likes: 1,
                comments: 1,
                photo: {
                  $cond: {
                    if: {
                      $or: [{ $eq: ["$photo", null] }, { $eq: ["$photo", ""] }],
                    },
                    then: "",
                    else: { $concat: [process.env.imagePath, "$photo"] },
                  },
                },
              },
            },
          ],
          as: "posts",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $in: ["$$userId", "$followers.userId"] } } },
            { $project: { firstName: 1, lastName: 1 } },
          ],
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $in: ["$$userId", "$following.userId"] } } },
            { $project: { firstName: 1, lastName: 1 } },
          ],
          as: "following",
        },
      },
      {
        $addFields: {
          numberOfFollowers: { $size: "$followers" },
          numberOfFollowing: { $size: "$following" },
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    if (!aggregateData.length) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.status(200).json(aggregateData[0]);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id; // Extract user ID from request parameters
  const userData = req.body; // Extract user data from request body
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const followUser = async (req, res) => {
  try {
    const userId = req.params._id;
    const currentUserId = req.user._id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = user.followers.some(
      (follower) =>
        follower.userId &&
        follower.userId.toString() === currentUserId.toString()
    );

    let updatedUser, updatedCurrentUser;

    if (isFollowing) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { followers: { userId: currentUserId } } },
        { new: true }
      );

      updatedCurrentUser = await User.findByIdAndUpdate(
        currentUserId,
        { $pull: { following: { userId: userId } } },
        { new: true }
      );

      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { followers: { userId: currentUserId } } },
        { new: true }
      );

      updatedCurrentUser = await User.findByIdAndUpdate(
        currentUserId,
        { $push: { following: { userId: userId } } },
        { new: true }
      );

      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  deleteUser,
  followUser,
};
