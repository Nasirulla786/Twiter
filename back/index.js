import express from "express";
import ConnectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.routes.js";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT  || 8000

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);

app.listen(port, function () {
  ConnectDb();
  console.log("server is running");
});
