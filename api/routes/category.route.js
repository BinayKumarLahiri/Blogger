import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import { body } from "express-validator";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
  getCategory,
} from "../controllers/category.controller.js";
const CategoryRouter = express.Router();

CategoryRouter.get("/getall", getAllCategory);

CategoryRouter.use(isLoggedIn);

CategoryRouter.post(
  "/add",
  isLoggedIn,
  [
    body("category")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Category Name Must be atleast 5 characters long"),
    body("slug")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Category Name Must be atleast 5 characters long"),
  ],
  addCategory
);
CategoryRouter.put(
  "/edit/:categoryId",
  [
    body("category")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Category Name Must be atleast 5 characters long"),
    body("slug")
      .isString()
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage("Category Name Must be atleast 5 characters long"),
  ],
  editCategory
);
CategoryRouter.get("/get/:categoryId", getCategory);
CategoryRouter.delete("/delete/:categoryId", deleteCategory);

export default CategoryRouter;
