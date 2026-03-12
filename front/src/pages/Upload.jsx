import axios from "axios";
import React, { useRef, useState } from "react";
import { ServerUrl } from "../App";
import { X, ImagePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPostData } from "../redux/slices/postSlice";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";

const Upload = ({ embedded, onClose }) => {
  const openImageRef = useRef();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [backendImage, setBackendImage] = useState("");
  const [frontendImage, setFrontendImage] = useState("");
  const [checkLoader, setCheckLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCheckLoader(true);
      const formData = new FormData();
      formData.append("title", name);
      formData.append("desc", desc);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(`${ServerUrl}/api/post/create`, formData, { withCredentials: true });
      if (res?.data?.data) {
        const allRes = await axios.get(`${ServerUrl}/api/post/allpost`, { withCredentials: true });
        dispatch(setPostData(allRes.data.data || []));
        setName("");
        setDesc("");
        setBackendImage("");
        setFrontendImage("");
        setCheckLoader(false);
        if (embedded && onClose) onClose();
        else navigate("/");
      }
    } catch (error) {
      console.log(error);
      setCheckLoader(false);
    }
  };

  const content = (
    <div className={embedded ? "p-4" : "main-middle border-x border-[var(--border-color)] min-h-screen"}>
      <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-color)]">
        {embedded ? (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
            aria-label="Back"
          >
            <X size={22} />
          </button>
        )}
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          {embedded ? "New post" : "Compose post"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex gap-3 pt-3">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.data?.name || "U")}&background=1d9bf0&color=fff&size=48`}
            alt=""
            className="w-12 h-12 rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Title (optional)"
              className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-xl py-2 focus:outline-none border-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="What is happening?!"
              rows={embedded ? 4 : 6}
              className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-xl py-2 resize-none focus:outline-none border-none mt-1"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
            {frontendImage && (
              <div className="relative mt-2 rounded-2xl overflow-hidden border border-[var(--border-color)]">
                <img src={frontendImage} alt="Preview" className="w-full max-h-80 object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setFrontendImage("");
                    setBackendImage("");
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={openImageRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setBackendImage(file);
              setFrontendImage(URL.createObjectURL(file));
            }
          }}
        />

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => openImageRef.current?.click()}
            className="p-2 rounded-full text-[var(--twitter-blue)] hover:bg-[var(--twitter-blue-light)] transition-colors"
            aria-label="Add image"
          >
            <ImagePlus size={22} />
          </button>
          <button
            type="submit"
            disabled={checkLoader || !desc.trim()}
            className="px-5 py-2 rounded-full bg-[var(--twitter-blue)] text-white font-bold disabled:opacity-50 hover:bg-[var(--twitter-blue-hover)] transition-colors"
          >
            {checkLoader ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );

  if (embedded) return content;
  return (
    <Layout showRight={false}>
      {content}
    </Layout>
  );
};

export default Upload;
