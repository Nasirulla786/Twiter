import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ServerUrl } from "../App";

const TRENDS = [
  { tag: "Trending in Dev", title: "#FullStack", count: "12.4K posts" },
  { tag: "Technology", title: "#AI", count: "89.2K posts" },
  { tag: "Trending", title: "#React", count: "45.1K posts" },
];

const Right = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  React.useEffect(() => {
    const fetchSuggested = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/auth/search?query=a`, { withCredentials: true });
        const users = res.data?.data || [];
        setSuggestedUsers(users.filter((u) => u._id !== userData?.data?._id).slice(0, 3));
      } catch {
        setSuggestedUsers([]);
      }
    };
    if (userData) fetchSuggested();
  }, [userData]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery("");
  };

  const user = userData?.data;

  return (
    <aside className="hidden lg:flex flex-col w-[350px] xl:w-[400px] min-h-screen sticky top-0 pl-4 pr-2 py-2 overflow-y-auto no-scrollbar">
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)] py-2 -mx-2 px-2">
        <form onSubmit={handleSearch} className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            size={20}
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-transparent focus:border-[var(--twitter-blue)] rounded-full py-2.5 pl-11 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none transition-colors"
          />
        </form>
      </div>

      <div className="mt-4 rounded-2xl bg-[var(--trends-bg)] overflow-hidden">
        <h2 className="px-4 py-3 text-[var(--text-primary)] font-bold text-xl">What's happening</h2>
        {TRENDS.map((trend, i) => (
          <button
            key={i}
            className="w-full px-4 py-3 flex flex-col items-start gap-0.5 hover:bg-[var(--bg-hover)] transition-colors text-left"
          >
            <span className="text-[var(--text-secondary)] text-sm">{trend.tag}</span>
            <span className="font-bold text-[var(--text-primary)]">{trend.title}</span>
            <span className="text-[var(--text-secondary)] text-sm">{trend.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-[var(--trends-bg)] overflow-hidden">
        <h2 className="px-4 py-3 text-[var(--text-primary)] font-bold text-xl">Who to follow</h2>
        {suggestedUsers.length === 0 ? (
          <div className="px-4 py-4 text-[var(--text-secondary)] text-sm">
            Follow more people to see suggestions here.
          </div>
        ) : (
          suggestedUsers.map((u) => (
            <button
              key={u._id}
              onClick={() => navigate(`/profile/${u._id}`)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[var(--bg-hover)] transition-colors text-left"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || "U")}&background=1d9bf0&color=fff&size=48`}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--text-primary)] truncate">{u.name}</p>
                <p className="text-[var(--text-secondary)] text-sm truncate">@{u.name?.replace(/\s/g, "").toLowerCase()}</p>
              </div>
              <span className="text-[var(--twitter-blue)] font-bold text-sm">View</span>
            </button>
          ))
        )}
      </div>

      {user && (
        <button
          onClick={() => navigate("/profile")}
          className="mt-4 rounded-2xl p-4 flex items-center gap-3 hover:bg-[var(--bg-hover)] transition-colors text-left w-full"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=1d9bf0&color=fff&size=48`}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[var(--text-primary)] truncate">{user.name}</p>
            <p className="text-[var(--text-secondary)] text-sm truncate">{user.email}</p>
          </div>
        </button>
      )}

      <div className="mt-4 px-2 py-3 flex flex-wrap gap-2 text-[var(--text-secondary)] text-xs">
        <span>Terms of Service</span>
        <span>Privacy Policy</span>
        <span>Cookie Policy</span>
        <span className="mt-2">© Twit Clone</span>
      </div>
    </aside>
  );
};

export default Right;
