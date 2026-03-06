import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const PostModel = mongoose.model("PostModel", postSchema);

export default PostModel;
