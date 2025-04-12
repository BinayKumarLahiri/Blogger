import express from "express";
import { isLoggedIn, isUserLoggedIn } from "../middleware/auth.middleware.js";
import {
  add,
  getAll,
  getAllComments,
  remove,
} from "../controllers/comment.controller.js";
import { body } from "express-validator";
const CommentRouter = express.Router();

CommentRouter.get("/getall/:blogId", getAll);
CommentRouter.get("/getallcomment", isLoggedIn, getAllComments);

CommentRouter.use(isUserLoggedIn);
CommentRouter.post(
  "/add",
  [
    body("blog").isString().trim().notEmpty(),
    body("content").isString().trim().notEmpty(),
  ],
  add
);
CommentRouter.delete("/remove/:commentId", remove);

export default CommentRouter;
