import React, { useState } from "react";
import Left from "../components/Left";
import Middle from "../components/Middle";
import Right from "../components/Right";
import Layout from "../components/Layout";
import Upload from "./Upload";

const Home = () => {
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <Left onComposeClick={() => setShowCompose(true)} />
      <main className="flex-1 flex justify-center pb-16 sm:pb-0 min-h-screen">
        <Middle />
      </main>
      <aside className="hidden lg:block">
        <Right />
      </aside>
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--bg-primary)] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden border border-[var(--border-color)]">
            <Upload onClose={() => setShowCompose(false)} embedded />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
