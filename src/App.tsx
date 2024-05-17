import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound_404";
import Login from "./pages_admin/Login.tsx";
import AdminHome from "./pages_admin/Home.tsx";
import Chat from "./pages/Chat.tsx";
import LoginChat from "./pages/LoginChat.tsx";
import { Supabase } from "./db/Supabase.ts";
import { useState } from "react";
import toastNotify from "./commons/Toast.tsx";
import { ToastContainer } from "react-toastify";

function App() {
  const [userInfo, setUserInfo] = useState<any>();

  const navigate = useNavigate();

  const supabases = Supabase();

  const getSession = async () => {
    const { data, error } = await supabases.auth.getSession();

    if (error) {
      console.log("Something error", error.message);
    }

    if (data.session == null) {
      toastNotify({ message: "Please login first", type: "error" });
      navigate("/login_chat");
    } else {
      console.log(data);

      setUserInfo(data.session.user.user_metadata);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/login" element={<LoginChat />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to={"/404"} />} />
    </Routes>
  );
}

export default App;
