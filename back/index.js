import express from "express";
import ConnectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.routes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();


app.use(express.json()) 
app.use(cookieParser());



app.use("/api/auth" , authRouter);
app.use("/api/post" , postRouter)








app.listen(3000 , function(){
    ConnectDb();
    console.log("server is running");
})
