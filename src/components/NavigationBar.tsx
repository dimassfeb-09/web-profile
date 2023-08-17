import { DarkMode, LightMode } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

enum activeNav {
  Home = "home",
  About = "about",
  Contact = "contact",
  Portfolio = "portfolio",
}

type NavigationProps = {
  darkMode: boolean;
  handleDarkMode: () => void;
};

function NavigationBar(props: NavigationProps) {
  const [hiddenNav, setHiddenNav] = useState(true);
  const [nav, setActiveNav] = useState<activeNav>();
  const path = useLocation().pathname;

  const handleClickHiddenNav = () => {
    setHiddenNav(!hiddenNav);
  };

  useEffect(() => {
    switch (path) {
      case "/about":
        setActiveNav(activeNav.About);
        break;
      case "/contact":
        setActiveNav(activeNav.Contact);
        break;
      case "/portopolio":
        setActiveNav(activeNav.Portfolio);
        break;
      default:
        setActiveNav(activeNav.Home);
    }
  }, [path]);

  return (
    <>
      <nav
        className="dark z-50 fixed flex flex-row items-center w-full h-[70px] justify-around 
                text-sm md:text-lg backdrop-blur-md 
                bg-opacity-30 border-b dark:border-b-darkColor sm:justify-around
                dark:bg-darkColor dark:text-white"
      >
        <Link to="/" className="hidden sm:block text-sm font-bold sm:text-lg">
          Dimas Febriyanto
        </Link>
        <div className={`flex flex-row gap-3 sm:bg-transparent sm:gap-10`}>
          <div className="group/home flex" onClick={handleClickHiddenNav}>
            <Link to="/">Beranda</Link>
            <span
              className={`h-[0.15em] ${
                nav == activeNav.Home ? "w-[3.7767em]" : "w-0"
              } bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/home:w-[3.7767em]`}
            ></span>
          </div>
          <div className="group/about flex" onClick={handleClickHiddenNav}>
            <Link to="/about">Tentang</Link>
            <span
              className={`h-[0.15em] ${
                nav == activeNav.About ? "w-[3.59em]" : "w-0"
              }  bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/about:w-[3.59em]`}
            ></span>
          </div>
          <div className="group/contact flex" onClick={handleClickHiddenNav}>
            <Link to="/contact">Kontak</Link>
            <span
              className={`h-[0.15em] ${
                nav == activeNav.Contact ? "w-[3.15em]" : "w-0"
              }  bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/contact:w-[3.15em]`}
            ></span>
          </div>
          <div className="group/portfolio flex" onClick={handleClickHiddenNav}>
            <Link to="/portopolio">Portfolio</Link>
            <span
              className={`h-[0.15em] ${
                nav == activeNav.Portfolio ? "w-[3.95em]" : "w-0"
              }  bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/portfolio:w-[3.95em]`}
            ></span>
          </div>
        </div>
        <div
          className={`flex justify-center ${
            props.darkMode ? "text-white" : "text-black"
          }`}
        >
          <button onClick={props.handleDarkMode}>
            {props.darkMode ? <DarkMode /> : <LightMode />}
          </button>
        </div>
      </nav>

      <div className="absolute bg-gradient-to-r from-blue-700 via-pink-500 to-purple-500 h-20 blur-2xl opacity-30 w-full"></div>
    </>
  );
}

export default NavigationBar;
