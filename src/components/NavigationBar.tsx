import { useState } from "react";
import { Link } from "react-router-dom";

enum activeNav {
  Home = "home",
  About = "about",
  Contact = "contact",
  Portfolio = "portfolio",
}

function NavigationBar() {
  const [hiddenNav, setHiddenNav] = useState(true);
  const [nav, setActiveNav] = useState<activeNav>(activeNav.Home);

  const handleClickHiddenNav = (activeNav: activeNav) => {
    setHiddenNav(!hiddenNav);
    setActiveNav(activeNav);
  };

  return (
    <>
      <nav className="z-50 fixed flex flex-row items-center w-full h-[70px] justify-around text-sm md:text-lg backdrop-blur-md bg-opacity-30 border-b sm:justify-around">
        <Link to="/" className="text-sm font-bold sm:text-lg">
          Dimas Febriyanto
        </Link>
        <div className={`flex flex-row gap-3 sm:bg-transparent  sm:gap-10`}>
          <div
            className="group/home flex"
            onClick={() => handleClickHiddenNav(activeNav.Home)}
          >
            <Link to="/">Beranda</Link>
            <span
              className={`h-[0.15em] ${
                nav == activeNav.Home ? "w-[3.7767em]" : "w-0"
              } bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/home:w-[3.7767em]`}
            ></span>
          </div>
          <div
            className="group/about flex"
            onClick={() => handleClickHiddenNav(activeNav.About)}
          >
            <Link to="/about">Tentang</Link>
            <span
              className={`h-[0.15em] ${
                nav == activeNav.About ? "w-[3.59em]" : "w-0"
              }  bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/about:w-[3.59em]`}
            ></span>
          </div>
          <div
            className="group/contact flex"
            onClick={() => handleClickHiddenNav(activeNav.Contact)}
          >
            <Link to="/contact">Kontak</Link>
            <span
              className={`h-[0.15em] ${
                nav == activeNav.Contact ? "w-[3.15em]" : "w-0"
              }  bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/about:w-[3.15em]`}
            ></span>
          </div>
          <div
            className="group/portfolio flex"
            onClick={() => handleClickHiddenNav(activeNav.Portfolio)}
          >
            <Link to="/portopolio">Portfolio</Link>
            <span
              className="h-[0.15em] w-0 bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/portfolio:w-[3.95em]"
            ></span>
          </div>
        </div>
      </nav>
      <div className="absolute bg-gradient-to-r from-blue-700 via-pink-500 to-purple-500 h-20 blur-2xl opacity-30 w-full"></div>
    </>
  );
}

export default NavigationBar;
