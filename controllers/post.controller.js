import Post from "../models/postSchema.js";
import like from "../models/likeSchema.js";
import comment from "../models/commentSchema.js";
import User from "../models/userSchema.js";
import helper from "../helper/helper.js";
const createPost = async (req, res) => {
  const { title, content } = req.body;
  const photo = req.file ? req.file.filename : null;
  try {
    const post = await Post.create({
      title,
      content,
      photo,
      user_id: req.user._id,
    });
    return res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user_id", "firstName lastName");
    const count = await Post.countDocuments();

    return res.status(200).json({ posts, count });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user_id",
      "firstName lastName"
    );
    return res.status(200).json({ post });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    await post.remove();
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  const { post_id, user_id } = req.body;
  try {
    const post = await Post.findById(req.body.post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Post already liked" });
    }
    const user = await User.findById(user_id);

    const postOwner = await User.findById(post.user_id);
    if (postOwner) {
      await helper.dynamicMailer(
        postOwner.email,
        "Your post was liked!",
        `${user.firstName} ${user.lastName} liked your post.`
      );
    }
    await like.create({ user_id: req.user._id, post_id: req.body.post_id });
    return res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.body.post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const postOwner = await User.findById(post.user_id);
    if (postOwner) {
      await helper.dynamicMailer(
        postOwner.email,
        "New comment on your post!",
        `${user.firstName} ${user.lastName} commented on your post:hiiii`
      );
      console.log(postOwner.email);
    }
    await comment.create({
      user_id: req.user._id,
      post_id: req.body.post_id,
      comment: req.body.comment,
    });
    return res.status(200).json({ message: "Comment added successfully" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
};
