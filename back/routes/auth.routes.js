import express, { Router } from "express"
import { getCurrentUser, login, logout, Register, searchUsers, getUserById } from "../controllers/auth.controller.js"
import isAuth from "../middleware/isAuth.js"

const authRouter = express(Router())

authRouter.post("/register" , Register)
authRouter.post("/login" , login)
authRouter.get("/logout", logout);
authRouter.get("/currentuser" , isAuth , getCurrentUser)
authRouter.get("/search", isAuth, searchUsers)
authRouter.get("/user/:userId", isAuth, getUserById)


export default authRouter
