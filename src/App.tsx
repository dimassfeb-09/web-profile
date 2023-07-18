import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Portfolio from "./pages/Portfolio";
import Footer from "./commons/Footer";
import NotFound from "./pages/NotFound_404";
import NavigationBar from "./commons/NavigationBar";
import {useEffect, useState} from "react";

function App() {
  const currentPage = useLocation();


  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {currentPage.pathname != "/404" ? <NavigationBar></NavigationBar> : <></>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portopolio" element={<Portfolio />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to={"/404"} />} />
      </Routes>
      {currentPage.pathname != "/404" ? <Footer scrollY={scrollY}></Footer> : <></>}
    </>
  );
}

export default App;
