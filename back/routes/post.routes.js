import express, { Router } from "express";
import {
  CreatePost,
  CurrentUserPost,
  EditPost,
  getAllsaves,
  getComments,
  LikePost,
  readAllpost,
  SavePost,
  getUserPosts,
} from "../controllers/post.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const postRouter = express(Router());

postRouter.post("/create", isAuth, upload.single("image"), CreatePost);
postRouter.post("/edit/:id", isAuth, upload.single("image"), EditPost);
postRouter.get("/allpost", isAuth, readAllpost);
postRouter.get("/currentuserpost", isAuth, CurrentUserPost);
postRouter.get("/user/:userId", isAuth, getUserPosts);
postRouter.get("/getlike/:id", isAuth, LikePost);
postRouter.post("/getcomment/:id" , isAuth , getComments)
postRouter.get("/save/:id" , isAuth , SavePost)
postRouter.get("/getsave" , isAuth , getAllsaves);

export default postRouter;
