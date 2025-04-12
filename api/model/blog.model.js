import mongoose from "mongoose";
const blogSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: true,
    minLength: [5, "Title Must be atleast 5 characters long"],
  },
  slug: {
    type: String,
    trim: true,
    require: true,
    minLength: [5, "Slug Must be atleast 5 characters long"],
  },
  content: {
    type: String,
    trim: true,
    require: true,
    minLength: [20, "Content must be atleast 20 characters long"],
  },
  thumbnail: {
    type: String,
    trim: true,
    require: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const blogModel = mongoose.model("blog", blogSchema);
export default blogModel;
