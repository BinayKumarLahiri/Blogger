import express from "express";
import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    //console.log(req.cookies);
    const token = req.cookies.token;
    // //console.log(token);
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access Denied" });
    const userData = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const user = await userModel.findOne({ _id: userData.id });
    // //console.log(user);
    if (!user || user.role !== "admin")
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access Denied" });

    next();
  } catch (err) {
    //console.log("MiddleWare:", err);
    res.status(500).json({ success: false, message: "Internal server Error" });
  }
};

export const isUserLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access Denied" });
    const userData = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const user = await userModel.findOne({ _id: userData.id });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access Denied" });

    req.user = user; // Setting the user to the request for further uses
    next();
  } catch (err) {
    //console.log("MiddleWare:", err);
    res.status(500).json({ success: false, message: "Internal server Error" });
  }
};
