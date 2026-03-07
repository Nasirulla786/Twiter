import PostModel from "../models/post.model.js";
import uploadOncloudinary from "../services/cloudinary.js";

export const CreatePost = async (req, res) => {
  try {
    const { title, desc } = req.body;
    const userid = req.userId;
    if (!title || !desc) {
      return res.status(400).json({ message: "Required all fields" });
    }

    let image;
    if (req.file) {
      image = await uploadOncloudinary(req.file.path);
    }

    const post = await PostModel.create({
      title,
      desc,
      image,
      author: userid,
    });
    return res.status(200).json({ data: post });
  } catch (error) {
    console.log(error);
  }
};

export const EditPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id);
    const userID = req.userId;
    const { title, desc } = req.body;
    let image;
    if (req.file) {
      image = await uploadOncloudinary(req.file.path);
    }
    if (!post) {
      return res.status(400).json({ message: "post not found " });
    }

    const editPost = await PostModel.findByIdAndUpdate(
      id,
      {
        title,
        desc,
        image,
        author: userID,
      },
      { new: true },
    );

    return res.status(200).json({ data: editPost });
  } catch (error) {
    console.log(error);
  }
};

export const readAllpost = async (req, res) => {
  try {
    const userId = req.userId
    const post = await PostModel.find({author:{$ne:userId}}).populate("author");
    if (post.length == 0) {
      return res.status(400).json({ message: "posts not found " });
    }

    return res.status(200).json({ data: post });
  } catch (error) {
    console.log(error);
  }
};
