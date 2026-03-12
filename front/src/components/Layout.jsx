import React from "react";
import Left from "./Left";
import Right from "./Right";

const Layout = ({ children, showRight = true, onComposeClick }) => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Left onComposeClick={onComposeClick} />
      <main className="flex-1 flex justify-center pb-16 sm:pb-0 min-h-screen">
        {children}
      </main>
      {showRight && <Right />}
    </div>
  );
};

export default Layout;
