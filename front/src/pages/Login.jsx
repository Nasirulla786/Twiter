import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setuserData } from "../redux/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { ServerUrl } from "../App";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${ServerUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (res.data) {
        dispatch(setuserData(res.data));
        alert("Login successfully");
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">

      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Login Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="text-sm text-slate-300 block mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-slate-300 block mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
          >

            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {loading ? "Logging in..." : "Login"}

          </button>

        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-slate-400 mt-4">
          Don't have an account?

          <Link
            to="/signup"
            className="text-violet-400 hover:underline ml-1"
          >
            Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;
