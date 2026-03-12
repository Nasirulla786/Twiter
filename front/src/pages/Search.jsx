import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { Search as SearchIcon } from "lucide-react";
import Layout from "../components/Layout";

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [searchterm, setSearchterm] = useState(initialQ);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setSearchterm(initialQ);
    if (!initialQ.trim()) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    axios
      .get(`${ServerUrl}/api/auth/search?query=${encodeURIComponent(initialQ)}`, { withCredentials: true })
      .then((response) => {
        if (!cancelled) setSearchResults(response.data.data || []);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to search users. Please try again.");
          setSearchResults([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [initialQ]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchterm.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true });
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <Layout>
      <div className="main-middle border-x border-[var(--border-color)] min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur border-b border-[var(--border-color)] p-3">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              size={22}
            />
            <input
              type="text"
              placeholder="Search people"
              value={searchterm}
              onChange={(e) => setSearchterm(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] rounded-full py-2.5 pl-12 pr-4 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--twitter-blue)] border border-transparent"
            />
          </form>
        </header>

        <div className="flex-1 p-4">
          {error && (
            <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[var(--twitter-blue)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && searchterm && searchResults.length === 0 && !error && (
            <p className="text-[var(--text-secondary)] text-center py-8">
              No people found for "{searchterm}"
            </p>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-[var(--text-secondary)] text-sm font-medium mb-3">People</h2>
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--bg-hover)] transition-colors text-left"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=1d9bf0&color=fff&size=56`}
                    alt=""
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[var(--text-primary)] text-lg">{user.name}</h3>
                    <p className="text-[var(--text-secondary)] text-sm truncate">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searchterm && !loading && (
            <p className="text-[var(--text-secondary)] text-center py-12">
              Search for people by name or email
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
