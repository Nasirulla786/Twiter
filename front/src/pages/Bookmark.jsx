import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSavePost } from "../redux/slices/postSlice";
import { ServerUrl } from "../App";
import { Bookmark, X, Heart } from "lucide-react";
import Layout from "../components/Layout";

function PostModal({ post, close }) {
  const author = post?.author;
  const name = author?.name || "User";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={close}>
      <div
        className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b border-[var(--border-color)]">
          <span className="font-bold text-[var(--text-primary)]">Post</span>
          <button
            onClick={close}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
          >
            <X size={22} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d9bf0&color=fff&size=48`}
              alt=""
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[var(--text-primary)]">{name}</p>
              {post.title && <p className="text-[var(--text-primary)] font-medium">{post.title}</p>}
              {post.desc && <p className="text-[var(--text-primary)] whitespace-pre-wrap">{post.desc}</p>}
              {post.image && (
                <img src={post.image} alt="" className="mt-2 rounded-2xl w-full max-h-80 object-cover" />
              )}
              <div className="flex gap-4 mt-2 text-[var(--text-secondary)] text-sm">
                <span>❤️ {post.likes?.length || 0}</span>
                <span>💬 {post.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BookmarkPage = () => {
  const dispatch = useDispatch();
  const { savePost } = useSelector((state) => state.post);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/post/getsave`, { withCredentials: true });
        const data = res.data.data || [];
        setSavedPosts(Array.isArray(data) ? data : []);
        const ids = (Array.isArray(data) ? data : []).map((p) => p._id?.toString()).filter(Boolean);
        dispatch(setSavePost(ids));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [dispatch]);

  const toggleSave = async (e, postId) => {
    e.stopPropagation();
    try {
      const res = await axios.get(`${ServerUrl}/api/post/save/${postId}`, { withCredentials: true });
      const saved = res.data?.user?.saved || [];
      const ids = saved.map((p) => p._id?.toString()).filter(Boolean);
      dispatch(setSavePost(ids));
      setSavedPosts(Array.isArray(saved) ? saved : []);
      if (selectedPost?._id === postId) setSelectedPost(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <div className="main-middle border-x border-[var(--border-color)] min-h-screen">
        <header className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur border-b border-[var(--border-color)] px-4 py-3">
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Bookmarks</h1>
          <p className="text-[var(--text-secondary)] text-sm">Saved posts</p>
        </header>

        <div className="p-4">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[var(--twitter-blue)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && savedPosts.length === 0 && (
            <p className="text-[var(--text-secondary)] text-center py-16">No saved posts yet.</p>
          )}

          {!loading && savedPosts.length > 0 && (
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.map((post) => (
                <div
                  key={post._id}
                  className="relative group aspect-square bg-[var(--bg-secondary)] overflow-hidden"
                >
                  {post.image ? (
                    <img
                      src={post.image}
                      alt=""
                      onClick={() => setSelectedPost(post)}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  ) : (
                    <div
                      onClick={() => setSelectedPost(post)}
                      className="w-full h-full flex items-center justify-center p-2 text-[var(--text-secondary)] text-sm cursor-pointer"
                    >
                      {post.title || post.desc?.slice(0, 40) || "Post"}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 text-white transition-opacity">
                    <span className="flex items-center gap-1">
                      <Heart size={18} /> {post.likes?.length || 0}
                    </span>
                    <button
                      onClick={(e) => toggleSave(e, post._id)}
                      className="p-2 rounded-full hover:bg-white/20"
                      aria-label="Remove from bookmarks"
                    >
                      <Bookmark size={18} fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedPost && (
          <PostModal post={selectedPost} close={() => setSelectedPost(null)} />
        )}
      </div>
    </Layout>
  );
};

export default BookmarkPage;
