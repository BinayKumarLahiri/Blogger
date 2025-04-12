import express from "express";
import dotenv from "dotenv";
// import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import UserRouter from "./routes/user.route.js";
import CategoryRouter from "./routes/category.route.js";
import BlogRouter from "./routes/blog.route.js";
import CommentRouter from "./routes/comment.route.js";
dotenv.config();
const port = process.env.PORT || 8000;
const client = process.env.CLIENT_DOMAIN;
const app = express();

app.use(
  cors({
    origin: client,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, { dbName: "Blog" })
  .then(() => {
    console.log("Database Connection Successfull");
  })
  .catch((err) => {
    console.log("Database Connection Failed");
    console.log(err);
  });

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server Listening" });
});

app.use("/user", UserRouter);
app.use("/category", CategoryRouter);
app.use("/blog", BlogRouter);
app.use("/comment", CommentRouter);

app.listen(port, () => {
  console.log("Server Listening at port:", port);
});
