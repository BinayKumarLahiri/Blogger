import userModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import cloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
  // If form data validation fails then return a 400 : Bad Request Error
  const error = validationResult(req);
  if (!error.isEmpty())
    return res.status(400).json({ success: false, error: error.array() });
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User Already exists." }); // Return if the there is already a user with given email
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!newUser)
      res
        .status(400)
        .json({ sucess: false, message: "Error Creating account" });
    res
      .status(200)
      .json({ success: true, message: "Account Created Successfully." });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res.status(400).json({ success: false, error: error.array() });
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      process.env.JWT_PRIVATE_KEY
    );
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "User Login Successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.created,
      },
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const googleLogin = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty())
    return res.status(400).json({ success: false, error: error.array() });
  try {
    const { name, email, avatar } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      const genPassword = Math.random() * 1000000000;
      const hashedPassword = await bcrypt.hash(genPassword.toString(), 10);
      user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        avatar,
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      process.env.JWT_PRIVATE_KEY
    );
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "User Login Successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.created,
      },
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      // maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "User Logout Successful",
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userid } = req.params;
    const file = req.file;
    let user = await userModel.findById(userid);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Doesn't exists" });
    }
    if (file) {
      const uploadResult = await cloudinary.uploader
        .upload(file.path)
        .catch((error) => {
          throw new Error(error.message);
        });
      //console.log(uploadResult);
      if (uploadResult) {
        user.avatar = uploadResult.secure_url;
      }
    }
    const { name, bio, password } = req.body;
    if (name && name.length >= 3) user.name = name;
    if (bio) user.bio = bio;
    if (password && password.length >= 8) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    user = await user.save();
    if (!user) throw new Error("Error Updating User");
    return res.status(200).json({
      success: true,
      message: "profile Updated Successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.created,
      },
    });
  } catch (err) {
    //console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await userModel
      .find({}, "-password")
      .sort({ created: -1 })
      .lean()
      .exec();
    if (!users)
      return res
        .status(400)
        .json({ sucess: false, message: "Failed to fetch the users" });
    res.status(200).json({
      sucess: true,
      message: "Users Fetched Sucessfully",
      users: users,
    });
  } catch (err) {
    //console.log("Auth Controller: ", err);
    res.status(500).json({ sucess: false, message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deleteUser)
      res.status(400).json({ sucess: false, message: "Failed to delete User" });
    res.status(200).json({ sucess: true, message: "User Deleted Sucessfully" });
  } catch (err) {
    //console.log("Delete User: ", err);
    res.status(500).json({ sucess: false, message: "Internal Server Error" });
  }
};
