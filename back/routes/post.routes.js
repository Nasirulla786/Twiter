import express, { Router } from "express";
import {
  CreatePost,
  EditPost,
  readAllpost,
} from "../controllers/post.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const postRouter = express(Router());

postRouter.post("/create", isAuth, upload.single("image"), CreatePost);
postRouter.post("/edit/:id", isAuth, upload.single("image"), EditPost);
postRouter.get("/allpost", isAuth, readAllpost);

export default postRouter;
