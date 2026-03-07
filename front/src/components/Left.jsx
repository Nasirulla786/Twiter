import React, { useState } from "react";
import { Home, Search, User, Bookmark } from "lucide-react";

const Left = () => {
  const menu = [
    { name: "Home", icon: Home },
    { name: "Explore", icon: Search },
    { name: "Bookmarks", icon: Bookmark },
    { name: "Profile", icon: User },
  ];

  const [check, setCheck] = useState(false)

  return (
    <div className={`${check?"flex":"hidden"} transition  duration-100 ease-in-out   sm:flex h-screen w-[30vw] border-r border-gray-700 bg-black text-white  flex-col p-6`}>

      {/* Logo */}
      <h1 className="text-2xl font-bold mb-8">Twit</h1>


      {/* Menu */}
      <div className="flex flex-col gap-6 text-xl">
        {menu.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-900 p-3 rounded-full transition"
            >
              <Icon size={28} />
              <span className="font-medium">{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* Tweet Button */}
      <button className="mt-8 bg-blue-500 hover:bg-blue-600 transition rounded-full py-3 font-semibold text-lg w-[160px]">
        Post
      </button>
    </div>
  );
};

export default Left;
