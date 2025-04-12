import mongoose, { Schema } from "mongoose";

const userSchema = mongoose.Schema({
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
    trim: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minLenght: [3, "Name Must be atleast 3 characters long"],
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
    trim: true,
    minLength: [8, "Name Must be atleast 8 characters long"],
  },
  bio: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
