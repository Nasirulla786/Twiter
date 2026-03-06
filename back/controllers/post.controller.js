import PostModel from "../models/post.model.js";
import uploadOncloudinary from "../services/cloudinary.js";

export const CreatePost = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const userid = req.userId
    if (!title || !desc) {
      return res.status(400).json({ message: "Required all fields" });
    }

    let image;
    if(req.file){
        image = await uploadOncloudinary(req.file.path);
    }


    const post = await PostModel.create({
        title , desc , image , author:userid
    })
    return res.status(200).json({data:post})



  } catch (error) {
    console.log(error);
  }
};
