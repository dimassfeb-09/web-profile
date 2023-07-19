import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

function NavigationBar() {

    const [hiddenNav, setHiddenNav] = useState(true);
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);

        if (screenSize.width > 640) {
            setHiddenNav(false);
        } else {
            setHiddenNav(true);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [screenSize]);

    const handleClickHiddenNav = () => {
        setHiddenNav(!hiddenNav);
    };

    return (
        <>
            <nav
                className="fixed flex flex-col justify-between h-[70px] w-full  bg-gradient-to-r from-blue-600 to-blue-300 text-white sm:flex-row sm:justify-around">
                <Link to="/" className="p-5">
                    Dimas Febriyanto
                </Link>
                <div
                    className={`${
                        hiddenNav ? "hidden" : "static"
                    } flex flex-col p-5 bg-white sm:bg-transparent sm:flex sm:flex-row sm:gap-10 text-black sm:text-white`}
                >
                    <div
                        className="hover:border-b-2 hover:border-black"
                        onClick={handleClickHiddenNav}
                    >
                        <Link to="/">Beranda</Link>
                    </div>
                    <div
                        className="mt-5 sm:mt-0 hover:border-b-2 hover:border-black"
                        onClick={handleClickHiddenNav}
                    >
                        <Link to="/about">Tentang</Link>
                    </div>
                    <div
                        className="mt-5 sm:mt-0 hover:border-b-2 hover:border-black"
                        onClick={handleClickHiddenNav}
                    >
                        <Link to="/contact">Kontak</Link>
                    </div>
                    <div
                        className="mt-5 sm:mt-0 hover:border-b-2 hover:border-black"
                        onClick={handleClickHiddenNav}
                    >
                        <Link to="/portopolio">Portopolio</Link>
                    </div>
                </div>
                <div className="fixed top-0 right-0 p-5 text-white  sm:hidden">
          <span
              className={`${
                  hiddenNav ? "bg-black text-white" : "bg-white text-black"
              } px-4 py-2 rounded-sm hover:cursor-pointer`}
              onClick={handleClickHiddenNav}
          >
            Menu
          </span>
                </div>
            </nav>
        </>
    );
}

export default NavigationBar;
