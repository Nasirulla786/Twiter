import express, { Router } from "express"
import { login, logout, Register } from "../controllers/auth.controller.js"

const authRouter = express(Router())

authRouter.post("/register" , Register)
authRouter.post("/login" , login)
authRouter.get("/logout", logout);


export default authRouter
