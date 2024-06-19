import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

const Like = mongoose.model("Like", likeSchema) || mongoose.models.Like;
export default Like;
