import React, { useEffect, useState } from "react";
import { Close, Menu } from "@mui/icons-material";

const Nav = () => {
  const [navBar, setNavBar] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (screenSize.width > 620 && !navBar) {
    setNavBar(true);
  }

  return (
    <>
      <nav className="fixed bg-[#146C94] w-full text-white">
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="title p-5">Dimas Febriyanto</div>
            <button
              className="absolute p-5 right-1 sm:hidden"
              onClick={() => setNavBar(!navBar)}
            >
              {navBar ? <Close></Close> : <Menu></Menu>}
            </button>
            <ul
              className={
                navBar
                  ? "flex flex-col px-5 mb-5 relative top-0 space-y-2 sm:space-y-0 sm:flex-row sm:p-5 sm:space-x-8 sm:mt-0 sm:mb-0 md:space-x-16"
                  : "hidden"
              }
            >
              <li className="hover:bg-[#AFD3E2] p-3 hover:transition hover:duration-75 hover:ease-in-out sm:p-0">
                Home
              </li>
              <li className="hover:bg-[#AFD3E2] p-3 hover:transition hover:duration-75 hover:ease-in-out sm:p-0">
                About
              </li>
              <li className="hover:bg-[#AFD3E2] p-3 hover:transition hover:duration-75 hover:ease-in-out sm:p-0">
                Contact
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
