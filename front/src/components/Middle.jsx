import axios from "axios";
import React, { useEffect, useState } from "react";
import { ServerUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData, setSavePost } from "../redux/slices/postSlice";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

function timeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const sec = Math.floor((now - d) / 1000);
  if (sec < 60) return "Now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return d.toLocaleDateString();
}

const Middle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postData, savePost } = useSelector((state) => state.post);
  const { userData } = useSelector((state) => state.user);

  const [openComment, setOpenComment] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/post/allpost`, { withCredentials: true });
        dispatch(setPostData(res.data.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPosts();
  }, [dispatch]);

  const handleLike = async (id) => {
    try {
      const res = await axios.get(`${ServerUrl}/api/post/getlike/${id}`, { withCredentials: true });
      const updatePost = res.data.post;
      const updatedPost = postData.map((post) => (post._id === id ? updatePost : post));
      dispatch(setPostData(updatedPost));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (id) => {
    try {
      const res = await axios.post(
        `${ServerUrl}/api/post/getcomment/${id}`,
        { message },
        { withCredentials: true }
      );
      const updatePost = res.data.post;
      const updatedPosts = postData.map((post) => (post._id === id ? updatePost : post));
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (id) => {
    try {
      const res = await axios.get(`${ServerUrl}/api/post/save/${id}`, { withCredentials: true });
      const data = res.data.user.saved.map((p) => p._id);
      dispatch(setSavePost(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="main-middle bg-[var(--bg-primary)] min-h-screen overflow-y-auto no-scrollbar flex flex-col">
      <header className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur border-b border-[var(--border-color)] px-4 py-3">
        <h1 className="text-[var(--text-primary)] text-xl font-bold">Home</h1>
      </header>

      {postData && postData.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)] py-12">
          No posts yet. Be the first to post!
        </div>
      )}

      {postData &&
        postData.map((post) => {
          const liked = post?.likes?.includes(userData?.data?._id);
          const saved = savePost.includes(post._id?.toString());
          const author = post?.author;
          const name = author?.name || "User";
          const handle = "@" + (author?.name || "user").replace(/\s/g, "").toLowerCase();

          return (
            <article
              key={post._id}
              className="tweet-card border-b border-[var(--border-color)] px-4 py-3 transition-colors cursor-pointer"
              onClick={(e) => {
                if (!e.target.closest("button") && !e.target.closest("input")) {
                  setOpenComment(openComment === post._id ? null : post._id);
                }
              }}
            >
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(author?._id ? `/profile/${author._id}` : "/profile");
                  }}
                  className="flex-shrink-0"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d9bf0&color=fff&size=48`}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[var(--text-primary)]">{name}</span>
                    <span className="text-[var(--text-secondary)] text-[15px]">{handle}</span>
                    <span className="text-[var(--text-secondary)]">·</span>
                    <time className="text-[var(--text-secondary)] text-[15px]" dateTime={post.createdAt}>
                      {timeAgo(post.createdAt)}
                    </time>
                  </div>
                  {post.title && (
                    <p className="text-[var(--text-primary)] text-[15px] font-medium mt-0.5">{post.title}</p>
                  )}
                  {post.desc && (
                    <p className="text-[var(--text-primary)] text-[15px] whitespace-pre-wrap break-words mt-0.5">
                      {post.desc}
                    </p>
                  )}
                  {post.image && (
                    <div className="mt-2 rounded-2xl overflow-hidden border border-[var(--border-color)]">
                      <img src={post.image} alt="" className="w-full max-h-[400px] object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between max-w-[425px] mt-3 text-[var(--text-secondary)]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenComment(openComment === post._id ? null : post._id);
                      }}
                      className="flex items-center gap-2 p-2 rounded-full hover:bg-[var(--twitter-blue-light)] hover:text-[var(--twitter-blue)] transition-colors"
                    >
                      <MessageCircle size={18} />
                      <span className="text-sm">{post.comments?.length || 0}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Coming soon");
                      }}
                      className="flex items-center gap-2 p-2 rounded-full hover:bg-[var(--twitter-blue-light)] hover:text-[var(--twitter-blue)] transition-colors"
                    >
                      <Repeat2 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post._id);
                      }}
                      className="flex items-center gap-2 p-2 rounded-full hover:bg-[var(--twitter-blue-light)] hover:text-[var(--error)] transition-colors"
                    >
                      <Heart size={18} fill={liked ? "currentColor" : "none"} />
                      <span className="text-sm">{post.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(post._id);
                      }}
                      className="p-2 rounded-full hover:bg-[var(--twitter-blue-light)] hover:text-[var(--twitter-blue)] transition-colors"
                    >
                      <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {openComment === post._id && (
                    <div className="mt-3 pt-3 border-t border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Post your reply"
                          className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full px-4 py-2 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--twitter-blue)]"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                          onClick={() => handleComment(post._id)}
                          disabled={!message.trim()}
                          className="px-4 py-2 rounded-full bg-[var(--twitter-blue)] text-white font-bold text-sm disabled:opacity-50 hover:bg-[var(--twitter-blue-hover)]"
                        >
                          Reply
                        </button>
                      </div>
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                        {(post.comments || []).map((c) => (
                          <div key={c._id} className="flex gap-2 items-start">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.author?.name || "U")}&size=32`}
                              alt=""
                              className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                            <div>
                              <span className="font-bold text-[var(--text-primary)] text-sm">{c.author?.name}</span>
                              <span className="text-[var(--text-secondary)] text-sm ml-1">{c.message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
    </div>
  );
};

export default Middle;
