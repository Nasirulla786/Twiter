import { v2 as cloudinary } from "cloudinary";

import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const uploadOncloudinary = async (file) => {
  try {
    const res = await cloudinary.uploader.upload(file);
    return res.secure_url;
  } catch (error) {
    console.log("image error", error);
  }
};

export default uploadOncloudinary;
