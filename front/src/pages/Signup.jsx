import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setuserData } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";
// import { setuserData } from "../redux/authSlice";

const Signup = () => {
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${ServerUrl}/api/auth/register`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true },
      );

      if (res.data) {
        dispatch(setuserData(res.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-lg">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Join Today
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <span className="text-blue-500 hover:underline cursor-pointer" onClick={()=>{
            navigate("/login")
          }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
