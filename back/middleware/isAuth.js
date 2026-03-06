import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

import dotenv from "dotenv";
dotenv.config();

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!req.cookies.token) {
      return res.status(400).json({ message: "token not found" });
    }

    const veriFytoken = jwt.verify(token, process.env.JWT_SECRET);

    if (!veriFytoken) {
      return res.status(400).json({ message: "token not verify" });
    }

    const user = await User.findById(veriFytoken.id);

    if (!user) {
      return res.status(400).json({ message: "user not authenticate" });
    }

    req.userId = user._id;

    next();
  } catch (error) {
    console.log("is auth error", error);
  }
};

export default isAuth;
