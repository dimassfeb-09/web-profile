import "./App.css";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import NavigationBar from "./commons/NavigationBar";
import Contact from "./pages/Contact";
import Portopolio from "./pages/Portopolio";
import Footer from "./commons/Footer";

function App() {
  return (
    <>
      <NavigationBar></NavigationBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portopolio" element={<Portopolio />} />
      </Routes>
      <Footer></Footer>
    </>
  );
}

export default App;
