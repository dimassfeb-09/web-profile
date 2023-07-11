import "./App.css";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useRoutes,
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Portopolio from "./pages/Portopolio";
import Footer from "./commons/Footer";
import NotFound from "./pages/NotFound_404";
import NavigationBar from "./commons/NavigationBar";

function App() {
  const currentPage = useLocation();

  return (
    <>
      {currentPage.pathname != "/404" ? <NavigationBar></NavigationBar> : <></>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/portopolio" element={<Portopolio />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to={"/404"} />} />
      </Routes>
      {currentPage.pathname != "/404" ? <Footer></Footer> : <></>}
    </>
  );
}

export default App;
