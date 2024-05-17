import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound_404";
import Login from "./pages_admin/Login.tsx";
import AdminHome from "./pages_admin/Home.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to={"/404"} />} />
    </Routes>
  );
}

export default App;
