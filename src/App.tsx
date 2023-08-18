import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Portfolio from "./pages/Portfolio";
import Footer from "./commons/Footer";
import NotFound from "./pages/NotFound_404";
import NavigationBar from "./components/NavigationBar.tsx";
import Login from "./pages_admin/Login.tsx";
import AdminHome from "./pages_admin/Home.tsx";
import { useEffect, useState } from "react";

function App() {
  const currentPage = useLocation().pathname;
  const [darkMode, setDarkMode] = useState(true);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      localStorage.setItem("darkMode", "light");
    } else {
      localStorage.setItem("darkMode", "dark");
    }
  };

  useEffect(() => {
    const getDarkModeLocalStorage = localStorage.getItem("darkMode");

    if (getDarkModeLocalStorage == null) {
      setDarkMode(true);
      localStorage.setItem("darkMode", "dark");
      return;
    }

    if (getDarkModeLocalStorage == "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      {currentPage != "/404" &&
      currentPage != "/admin/login" &&
      currentPage != "/admin/home" ? (
        <NavigationBar handleDarkMode={handleDarkMode} darkMode={darkMode} />
      ) : (
        <></>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portopolio" element={<Portfolio />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to={"/404"} />} />
      </Routes>
      {currentPage != "/404" &&
      currentPage != "/admin/login" &&
      currentPage != "/admin/home" ? (
        <Footer></Footer>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
