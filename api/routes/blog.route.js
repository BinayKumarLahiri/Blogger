import express from "express";
import { isUserLoggedIn } from "../middleware/auth.middleware.js";
import {
  addBlog,
  editBlog,
  filterBlogs,
  getAllBlog,
  getBlog,
  getRelatedBlogs,
  getSingleBlog,
  removeBlog,
  searchBlogs,
  showAll,
} from "../controllers/blog.controller.js";
import { body } from "express-validator";
import upload from "../config/multer.js";

const BlogRouter = express.Router();

BlogRouter.get("/showAll", showAll);
BlogRouter.get("/getblog/:blogId", getSingleBlog);
BlogRouter.get("/getrelated/:category", getRelatedBlogs);
BlogRouter.get("/filter/:category", filterBlogs);
BlogRouter.get("/search", searchBlogs);

// Now apply the authentication middleware
BlogRouter.use(isUserLoggedIn);

BlogRouter.post(
  "/add",
  upload.single("thumbnail"),
  [
    body("title")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Title Must be atleast 5 characters long"),
    body("slug")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Title Must be atleast 5 characters long"),
    body("category").isString().trim().notEmpty(),
    body("content").isString().trim().notEmpty(),
  ],
  addBlog
);

BlogRouter.put(
  "/edit/:blogId",
  upload.single("thumbnail"),
  [
    body("title")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Title Must be atleast 5 characters long"),
    body("slug")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Title Must be atleast 5 characters long"),
    body("category").isString().trim().notEmpty(),
    body("content").isString().trim().notEmpty(),
  ],
  editBlog
);
BlogRouter.delete("/remove/:blogId", removeBlog);
BlogRouter.get("/get/:blogId", getBlog);
BlogRouter.get("/getall", getAllBlog);

export default BlogRouter;
