import React, { useState } from "react";
import { Home, Search, User, Bookmark, PenSquare, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setuserData } from "../redux/slices/userSlice";
import { ServerUrl } from "../App";

const Left = ({ onComposeClick }) => {
  const menu = [
    { name: "Home", icon: Home, route: "/" },
    { name: "Explore", icon: Search, route: "/search" },
    { name: "Bookmarks", icon: Bookmark, route: "/bookmark" },
    { name: "Profile", icon: User, route: "/profile" },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handlePost = () => {
    if (onComposeClick) onComposeClick();
    else navigate("/upload");
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${ServerUrl}/api/auth/logout`, { withCredentials: true });
      dispatch(setuserData(null));
      navigate("/login");
    } catch (e) {
      console.error(e);
    }
  };

  const isActive = (route) => {
    if (route === "/") return location.pathname === "/";
    return location.pathname.startsWith(route);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex sm:flex-col h-screen w-[88px] xl:w-[275px] border-r border-[var(--border-color)] bg-[var(--bg-primary)] px-2 xl:px-4 py-2 sticky top-0">
        <div className="mb-2 xl:mb-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center xl:justify-start p-3 rounded-full hover:bg-[var(--bg-hover)] transition-colors"
            aria-label="Home"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[var(--text-primary)] fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.route);
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`flex items-center gap-3 xl:gap-4 px-3 xl:px-4 py-3 rounded-full text-left transition-colors w-full ${
                  active
                    ? "font-bold text-[var(--text-primary)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <Icon size={26} strokeWidth={active ? 2.5 : 2} />
                <span className="hidden xl:inline text-[17px]">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={handlePost}
          className="mt-3 xl:mt-4 w-full flex items-center justify-center gap-2 bg-[var(--twitter-blue)] hover:bg-[var(--twitter-blue-hover)] text-white font-bold rounded-full py-3 xl:py-3.5 text-[17px] transition-colors"
        >
          <PenSquare size={22} className="xl:hidden" />
          <span className="hidden xl:inline">Post</span>
        </button>

        <div className="mt-auto py-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 xl:gap-4 px-3 xl:px-4 py-3 rounded-full w-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
          >
            <LogOut size={22} />
            <span className="hidden xl:inline text-[17px]">Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-primary)] border-t border-[var(--border-color)] flex items-center justify-around py-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`p-3 rounded-full transition-colors ${active ? "text-[var(--twitter-blue)]" : "text-[var(--text-secondary)]"}`}
              aria-label={item.name}
            >
              <Icon size={26} strokeWidth={active ? 2.5 : 2} />
            </button>
          );
        })}
        <button
          onClick={handlePost}
          className="p-3 rounded-full bg-[var(--twitter-blue)] text-white"
          aria-label="Post"
        >
          <PenSquare size={26} />
        </button>
      </nav>
    </>
  );
};

export default Left;
