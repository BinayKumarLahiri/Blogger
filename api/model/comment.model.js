import mongoose from "mongoose";
const commentSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
    require: true,
  },
  content: {
    type: String,
    trim: true,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const commentModel = mongoose.model("comment", commentSchema);
export default commentModel;
