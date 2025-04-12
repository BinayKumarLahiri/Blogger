import { validationResult } from "express-validator";
import commentModel from "../model/comment.model.js";

export const getAll = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await commentModel
      .find({ blog: blogId })
      .sort({ createdAt: -1 })
      .populate("author", "_id name avatar")
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      message: "Comments Fetched Successfully",
      comments: comments,
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const add = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res.status(400).json({ success: false, error: error.array() });
  try {
    const { blog, content } = req.body;
    //console.log("Creating Comment:", req.user);
    const comment = await commentModel.create({
      author: req.user._id,
      blog,
      content,
    });
    res.status(200).json({
      success: true,
      message: "Comment Added Successfully",
      comment: comment,
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const remove = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res.status(400).json({ success: false, error: error.array() });
  try {
    const { commentId } = req.params;
    const comment = await commentModel.findById(commentId);
    if (comment.author.equals(req.user._id) || req.user.role === "admin") {
      const deletedComment = await commentModel.findByIdAndDelete(commentId);

      res.status(200).json({
        success: true,
        message: "Comment Removed Successfully",
      });
    } else
      return res
        .status(400)
        .json({ success: false, message: "Unauthorised Access Denied" });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await commentModel
      .find()
      .populate("author", "_id name")
      .populate("blog", "_id title")
      .sort({ createdAt: -1 })
      .lean();
    if (!comments)
      res
        .status(400)
        .json({ success: false, message: "Failed to fetch comments" });
    res.status(200).json({
      success: true,
      message: "Commentsd Fetched Successfully",
      comments: comments,
    });
  } catch (err) {
    //console.log("Fething Comments: ", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
