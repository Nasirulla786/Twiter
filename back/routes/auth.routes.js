import express, { Router } from "express"
import { getCurrentUser, login, logout, Register } from "../controllers/auth.controller.js"
import isAuth from "../middleware/isAuth.js"

const authRouter = express(Router())

authRouter.post("/register" , Register)
authRouter.post("/login" , login)
authRouter.get("/logout", logout);
authRouter.get("/currentuser" , isAuth , getCurrentUser)


export default authRouter
