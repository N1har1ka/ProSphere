import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
const activeCheck = async (req, res) => {
  console.log("runnning");
};

const createPost = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
    });
    await post.save();
    return res.status(200).json({ message: "Post created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePictrue"
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorised" });
    }
    // post.active = false;
    // await post.save();
    await Post.deleteOne({ _id: post_id });
    return res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comments = await Comment.find({ postId: post_id }).populate(
      "userId",
      "username name profilePicture"
    );
    // if(!comments) return res.status(404).json({ message: "Post not found" });
    return res.json(comments.reverse());
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await Comment.deleteOne({ _id: comment_id });
    return res.status(200).json({ message: "comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const increment_likes = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    post.likes = post.likes + 1;
    await post.save();
    return req.json({ message: "likes incremented" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  get_comments_by_post,
  delete_comment_of_user,
  increment_likes,
};
