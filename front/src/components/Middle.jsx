import axios from "axios";
import React, { useEffect } from "react";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/slices/postSlice";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";

const Middle = () => {
  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/post/allpost`, {
          withCredentials: true,
        });

        dispatch(setPostData(res.data.data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPosts();
  }, []);

  return (
    <div className="w-full sm:w-[40vw] bg-black border-x border-gray-700 h-screen overflow-y-scroll no-scrollbar">

      {/* Header */}
      <div className="sticky top-0 bg-black border-b border-gray-700 p-4">
        <h1 className="text-white text-xl font-bold">Home</h1>
      </div>

      {/* Post Feed */}
      {postData &&
        postData.map((post) => {
          return (
            <div
              key={post._id}
              className="border-b border-gray-700 p-4 text-white"
            >
              {/* Author */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-600"></div>

                <div>
                  <h2 className="font-semibold">
                    {post?.author?.name || "User"}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Title */}
              <p className="mb-2">{post.title}</p>

              {/* Description */}
              <p className="text-gray-300 mb-3">{post.desc}</p>

              {/* Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="rounded-xl mb-3"
                />
              )}

              {/* Actions */}
              <div className="flex justify-between text-gray-400 mt-2">

                <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer">
                  <MessageCircle size={18} />
                </div>

                <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer">
                  <Repeat2 size={18} />
                </div>

                <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer">
                  <Heart size={18} />
                </div>

                <div className="flex items-center gap-2 hover:text-yellow-400 cursor-pointer">
                  <Bookmark size={18} />
                </div>

              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Middle;
