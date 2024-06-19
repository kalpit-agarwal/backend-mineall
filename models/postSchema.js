import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // likes: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Like",
    //   },
    // ],
    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment",
    //   },
    // ],
  },
  {
    timestamps: true,
    toObject: { getters: true, setters: true, virtuals: false },
    toJSON: { getters: true, setters: true, virtuals: false },
  }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
