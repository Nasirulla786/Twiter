import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { setuserData } from "./redux/slices/userSlice";


export const ServerUrl = "http://localhost:3000"
function App() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  useEffect(()=>{
    const fetchCurrentUser = async()=>{
      try {
        const res = await axios.get(`${ServerUrl}/api/auth/currentuser` , {withCredentials:true});
        dispatch(setuserData(res.data));

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

      </Routes>
    </div>
  );
}

export default App;
