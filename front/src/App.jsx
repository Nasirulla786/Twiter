import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setuserData } from "./redux/slices/userSlice";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import { setSavePost } from "./redux/slices/postSlice";
import Bookmark from "./pages/Bookmark";
import Search from "./pages/Search";



// export const ServerUrl = "http://localhost:3000"
export const ServerUrl = "https://twiter-pdqc.onrender.com"
function App() {
  const { userData } = useSelector((state) => state.user);
  const { savePost } = useSelector((state) => state.post);
  const dispatch = useDispatch();


  useEffect(()=>{
    const fetchCurrentUser = async()=>{
      try {
        const res = await axios.get(`${ServerUrl}/api/auth/currentuser` , {withCredentials:true});
        console.log("this is res",res.data);
        dispatch(setuserData(res.data));
        dispatch(setSavePost(res?.data?.data?.saved || []))

        console.log(savePost);

      } catch (error) {
        console.log(error);

      }
    }
    fetchCurrentUser();

  },[])



  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/upload"
          element={!userData ? <Login /> : < Upload/>}
        />
        <Route
          path="/profile"
          element={!userData ? <Login /> : < Profile />}
        />
        <Route
          path="/profile/:userId"
          element={!userData ? <Login /> : < Profile />}
        />
        <Route
          path="/bookmark"
          element={!userData ? <Login /> : < Bookmark />}
        />
        <Route
          path="/search"
          element={!userData ? <Login /> : < Search/>}
        />

      </Routes>
    </div>
  );
}

export default App;
