import { validationResult } from "express-validator";
import cloudinary from "../config/cloudinary.js";
import blogModel from "../model/blog.model.js";
import { encode } from "entities";
export const addBlog = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input", error: error.array() });
  try {
    const { title, slug, content, category } = req.body;
    const blogData = {
      title: title,
      slug: slug,
      content: "",
      category: category,
      author: req.user._id,
      thumbnail: "",
    };
    blogData.content = encode(content);
    const file = req.file;
    if (file) {
      const uploadResult = await cloudinary.uploader
        .upload(file.path)
        .catch((error) => {
          throw new Error(error.message);
        });
      //console.log(uploadResult);
      if (uploadResult) {
        blogData.thumbnail = uploadResult.secure_url;
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Blog Thumbnail Required" });
    }

    const blog = await blogModel.create(blogData);
    res.status(200).json({
      success: true,
      message: "Blog Created Successfully",
      blog: blog,
    });
  } catch (err) {
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};
export const editBlog = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input", error: error.array() });
  try {
    const { blogId } = req.params;
    const { title, slug, content, category } = req.body;
    const blogData = {
      title: title,
      slug: slug,
      category: category,
    };

    if (content && content.length > 20) blogData.content = encode(content);
    const file = req.file;
    if (file) {
      const uploadResult = await cloudinary.uploader
        .upload(file.path)
        .catch((error) => {
          throw new Error(error.message);
        });
      //console.log(uploadResult);
      if (uploadResult) {
        blogData.thumbnail = uploadResult.secure_url;
      }
    }

    const blog = await blogModel.findByIdAndUpdate(blogId, blogData, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Blog Updated Successfully",
      blog: blog,
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const removeBlog = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input", error: error.array() });
  try {
    const { blogId } = req.params;
    const findBlog = await blogModel.findById(blogId);
    if (
      findBlog &&
      (findBlog.author === req.user._id || req.user.role === "admin")
    ) {
      const blog = await blogModel.findByIdAndDelete(blogId);
      if (blog)
        return res
          .status(200)
          .json({ success: true, message: "Blog Deleted Successfully" });
    } else
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized access denied" });
  } catch (err) {
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};
export const getBlog = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input", error: error.array() });
  try {
    const { blogId } = req.params;
    const blog = await blogModel
      .findById(blogId)
      .populate({ path: "author", select: "name" })
      .populate({ path: "category", select: "category" });
    if (req.user.role === "admin" || blog.author === req.user._id)
      return res.status(200).json({
        success: true,
        message: "Blog Fetched Successfully",
        blog: blog,
      });
    else
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized access denied" });
  } catch (err) {
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};
export const getAllBlog = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input", error: error.array() });
  try {
    const blogs =
      req.user.role === "admin"
        ? await blogModel.find().sort({ createdAt: -1 }).lean().exec()
        : await blogModel
            .find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    return res.status(200).json({
      success: true,
      message: "Blogs Fetched Successfully",
      blogs: blogs,
    });
  } catch (err) {
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};

export const showAll = async (req, res) => {
  try {
    const blogs = await blogModel
      .find()
      .populate("author", "id name avatar role")
      .populate("category", "id category slug")
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      message: "Blogs Fetched Successfully",
      blogs: blogs,
    });
  } catch (err) {
    //console.log("showAll", err);
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await blogModel
      .findById(blogId)
      .populate("author", "id name avatar role")
      .populate("category", "id category slug")
      .lean()
      .exec();
    res.status(200).json({
      success: true,
      message: "Blog Fetched Successfully",
      blog: blog,
    });
  } catch (err) {
    //console.log("showAll", err);
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};

export const getRelatedBlogs = async (req, res) => {
  try {
    const { category } = req.params;
    //console.log(category);
    const blogs = await blogModel
      .find()
      .sort({ createdAt: -1 })
      .populate("category", "slug")
      .lean()
      .exec();
    const filteredBlogs = blogs.filter(
      (blog) => blog.category.slug === category
    );
    res.status(200).json({
      success: false,
      message: "Related Blogs Found Successfully",
      blogs: filteredBlogs,
    });
  } catch (err) {
    //console.log("showAll", err);
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};

export const filterBlogs = async (req, res) => {
  try {
    const { category } = req.params;
    const blogs = await blogModel
      .find()
      .populate("author", "id name avatar role")
      .populate("category", "id category slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const filteredBlogs = blogs.filter(
      (blog) => blog.category.slug === category
    );
    res.status(200).json({
      success: true,
      message: "Blogs Fetched Successfully",
      blogs: filteredBlogs,
    });
  } catch (err) {
    //console.log("showAll", err);
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};

export const searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;
    //console.log("Query: ", query);
    const blogs = await blogModel
      .find({
        title: { $regex: query, $options: "i" },
      })
      .populate("author", "id name avatar role")
      .populate("category", "id category slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    if (!blogs)
      return res
        .status(200)
        .json({ success: false, message: "Failed to search blogs" });
    res.status(200).json({
      success: true,
      message: "Blogs fetched Successfully",
      blogs: blogs,
    });
  } catch (err) {
    //console.log("Search Blogs: ", err);
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};
