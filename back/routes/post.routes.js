import express, { Router } from "express"
import { CreatePost } from "../controllers/post.controller.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"


const postRouter = express(Router())

postRouter.post("/create" ,  isAuth , upload.single("image") ,   CreatePost)





export default postRouter
