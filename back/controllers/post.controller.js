// import { use } from "react";
import User from "../models/auth.model.js";
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
    const userId = req.userId;
    const post = await PostModel.find({ author: { $ne: userId } }).populate(
      "author",
    );
    if (post.length == 0) {
      return res.status(400).json({ message: "posts not found " });
    }

    return res.status(200).json({ data: post });
  } catch (error) {
    console.log(error);
  }
};

export const CurrentUserPost = async (req, res) => {
  try {
    const userId = req.userId;

    const post = await PostModel.find({ author: userId });
    // console.log(post);

    return res.status(200).json({ data: post });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await PostModel.find({ author: userId }).populate('author', 'name');

    return res.status(200).json({ data: posts });
  } catch (error) {
    console.log("getUserPosts error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const LikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(400).json({ message: "posts not found " });
    }

    const alreadyLike = post.likes.some(
      (co) => co.toString() == userId.toString(),
    );
    if (alreadyLike) {
      post.likes = post.likes.filter(
        (post) => post.toString() != userId.toString(),
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({ post });
  } catch (error) {
    console.log(error);
  }
};

export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { message } = req.body;
    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(400).json({ message: "posts not found " });
    }

    post.comments.push({
      author: userId,
      message,
    });
    // post.comments.sort({ createdAt: -1 });

    await post.save();
    await post.populate("comments.author");

    return res.status(200).json({ post });
  } catch (error) {
    console.log(error);
  }
};

export const SavePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const post = await PostModel.findById(id);
    if (!post) {
      return res.status(400).json({ message: "posts not found " });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const alreadySaved = user.saved.some(
      (post) => post._id.toString() == id,
    );
    if (alreadySaved) {
      user.saved = user.saved.filter((post) => post._id.toString() != id);
    } else {
      user.saved.push(id);
    }

    await user.save();
    await user.populate("saved");

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};

export const getAllsaves = async(req , res)=>{
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("saved");
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json({data:user.saved});

  } catch (error) {
    console.log(error);

  }
}
