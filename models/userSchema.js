import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});
const followingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHERS"],
    },
    phone: {
      type: Number,
      maxlength: 10,
      minlength: 10,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    photo: {
      type: String,
    },
    followers: [followerSchema],
    following: [followingSchema],
  },

  {
    timestamps: true,
    toObject: { getters: true, setters: true, virtuals: false },
    toJSON: { getters: true, setters: true, virtuals: false },
  }
);

const User = mongoose.model("User", userSchema) || mongoose.models.User;
export default User;
