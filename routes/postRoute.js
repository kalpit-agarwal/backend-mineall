import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
} from "../controllers/post.controller.js";
import auth from "../middleware/auth.js";
import upload from "../helper/multer.js";

const router = express.Router();

router.post("/", auth, upload, createPost);
router.get("/", auth, getPosts);
router.get("/:id", auth, getPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.post("/like", auth, likePost);
router.post("/comment", auth, commentPost);

export default router;
