import {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  deleteUser,
  followUser,
} from "../controllers/user.controller.js";
import express from "express";
import auth from "../middleware/auth.js";
import validationMiddleWare from "../validations/users/auth.js";
import upload from "../helper/multer.js";

const router = express.Router();

router.post("/register", upload, registerUser);
router.post("/login", validationMiddleWare("loginUser"), loginUser);
router.post("/fetch/:id?", auth, fetchUser);
router.put("/update/:id", auth, updateUser);
router.delete("/delete/:id", auth, deleteUser);
router.post("/follow/:_id", auth, followUser);

export default router;
