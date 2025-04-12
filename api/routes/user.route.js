import express from "express";
import { Router } from "express";
import { body } from "express-validator";
import {
  deleteUser,
  getAllUser,
  googleLogin,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/auth.controller.js";
import upload from "../config/multer.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const UserRouter = Router();
UserRouter.post(
  "/register",
  [
    body("name")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long"),
    body("email").isString().trim().isEmail(),
    body("password")
      .isString()
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters long"),
  ],
  register
);
UserRouter.post(
  "/login",
  [
    body("email").isString().trim().isEmail(),
    body("password")
      .isString()
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be atleast 8 characters long"),
  ],
  login
);

UserRouter.post(
  "/google-login",
  [
    body("name")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Name must be atleast 3 characters long"),
    body("email").isString().trim().isEmail(),
  ],
  googleLogin
);

UserRouter.get("/logout", logout);
UserRouter.put(
  "/update-profile/:userid",
  upload.single("avatar"),
  updateProfile
);

UserRouter.get("/all-user", isLoggedIn, getAllUser);
UserRouter.delete("/delete/:userId", isLoggedIn, deleteUser);

export default UserRouter;
