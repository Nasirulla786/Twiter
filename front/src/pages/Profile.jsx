import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";
import Layout from "../components/Layout";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [postmap, setPostmap] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        if (userId) {
          const [userRes, postsRes] = await Promise.all([
            axios.get(`${ServerUrl}/api/auth/user/${userId}`, { withCredentials: true }),
            axios.get(`${ServerUrl}/api/post/user/${userId}`, { withCredentials: true }),
          ]);
          setProfileUser(userRes.data.data);
          setPostmap(postsRes.data.data || []);
        } else {
          const res = await axios.get(`${ServerUrl}/api/post/currentuserpost`, { withCredentials: true });
          setProfileUser(userData?.data);
          setPostmap(res.data.data || []);
        }
      } catch (error) {
        console.log(error?.response);
      } finally {
        setLoading(false);
      }
    };
    if (userData || userId) fetchProfileData();
  }, [userId, userData]);

  if (loading) {
    return (
      <Layout>
        <div className="main-middle border-x border-[var(--border-color)] min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--twitter-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!profileUser) {
    return (
      <Layout>
        <div className="main-middle border-x border-[var(--border-color)] min-h-screen flex items-center justify-center text-[var(--text-secondary)]">
          User not found
        </div>
      </Layout>
    );
  }

  const isOwnProfile = !userId || userData?.data?._id === userId;

  return (
    <Layout>
      <div className="main-middle border-x border-[var(--border-color)] min-h-screen">
        <header className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur border-b border-[var(--border-color)] flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="font-bold text-[var(--text-primary)] text-xl">{profileUser.name}</h1>
            <p className="text-[var(--text-secondary)] text-sm">{postmap.length} posts</p>
          </div>
        </header>

        <div className="border-b border-[var(--border-color)]">
          <div className="h-32 sm:h-40 bg-[var(--bg-secondary)]" />
          <div className="px-4 -mt-16 relative">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=1d9bf0&color=fff&size=128`}
              alt=""
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[var(--bg-primary)]"
            />
          </div>
          <div className="px-4 py-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{profileUser.name}</h2>
            <p className="text-[var(--text-secondary)] text-sm">{profileUser.email}</p>
            <p className="text-[var(--text-secondary)] text-sm mt-2">
              Joined {profileUser.createdAt ? new Date(profileUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "N/A"}
            </p>
            <div className="flex gap-4 mt-2 text-[var(--text-primary)]">
              <span><strong>{postmap.length}</strong> posts</span>
              <span><strong>0</strong> followers</span>
              <span><strong>0</strong> following</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-[var(--border-color)]">
          <h3 className="font-bold text-[var(--text-primary)]">Posts</h3>
        </div>

        {postmap.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-secondary)]">
            No posts yet
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {postmap.map((post) => (
              <button
                key={post._id}
                onClick={() => {}}
                className="aspect-square relative group overflow-hidden bg-[var(--bg-secondary)]"
              >
                {post.image ? (
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)] text-sm p-2">
                    {post.title || post.desc?.slice(0, 50)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 text-white transition-opacity">
                  <span>❤️ {post.likes?.length || 0}</span>
                  <span>💬 {post.comments?.length || 0}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
