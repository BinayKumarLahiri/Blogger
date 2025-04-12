import categoryModel from "../model/category.model.js";
import { validationResult } from "express-validator";
export const addCategory = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input", error: error.array() });
  try {
    const { category, slug } = req.body;
    const createdCategory = await categoryModel.create({ category, slug });
    if (!createdCategory)
      return res
        .status(400)
        .json({ success: false, message: "Error Creating the Category" });
    res
      .status(200)
      .json({ success: true, message: "Category Added Successfully" });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const editCategory = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input", error: error.array() });
  try {
    const { categoryId } = req.params;
    const { category, slug } = req.body;
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      { category: category, slug: slug },
      { new: true }
    );
    if (!updatedCategory)
      return res
        .status(400)
        .json({ success: true, message: "Error Updating the Category" });
    res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      category: updatedCategory,
    });
  } catch (err) {
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};
export const getCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    //console.log(categoryId);
    const category = await categoryModel.findOne({ _id: categoryId });
    if (!category)
      return res
        .status(400)
        .json({ success: true, message: "Category Doesn't Exists" });
    res
      .status(200)
      .json({ success: true, message: "Category Found", category: category });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getAllCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ category: 1 });
    res.status(200).json({
      success: true,
      message: "Categories Fetched Successfully",
      categories: categories,
    });
  } catch (err) {
    //console.log("Get All: ", err);
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const updatedCategory = await categoryModel.findByIdAndDelete(categoryId);
    if (!updatedCategory)
      return res
        .status(400)
        .json({ success: true, message: "Error Deleting the Category" });
    res.status(200).json({
      success: true,
      message: "Category Deleted Successfully",
      category: updatedCategory,
    });
  } catch (err) {
    res.status(500).json({ success: falses, message: "Internal Server Error" });
  }
};
