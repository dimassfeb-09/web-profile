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
                className="z-50 fixed flex flex-row items-center w-full h-[70px] justify-around text-sm md:text-lg bg-gradient-to-r from-blue-600 to-blue-300 text-white sm:justify-around">
                <Link to="/" className="hidden sm:block">
                    Dimas Febriyanto
                </Link>
                <img src="assets/img/logo.png" height={40} width={40} alt="Brand"
                     className="rounded-full sm:hidden"/>
                <div
                    className={`flex flex-row gap-3 sm:bg-transparent  sm:gap-10 text-white`}>
                    <div
                        className="group/home flex"
                        onClick={handleClickHiddenNav}
                    >
                        <Link to="/">Beranda</Link>
                        <span
                            className="h-[0.15em] w-0 bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/home:w-[3.7767em]"></span>
                    </div>
                    <div
                        className="group/about flex"
                        onClick={handleClickHiddenNav}
                    >
                        <Link to="/about">Tentang</Link>
                        <span
                            className="h-[0.15em] w-0 bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/about:w-[3.59em]"></span>
                    </div>
                    <div
                        className="group/contact flex"
                        onClick={handleClickHiddenNav}
                    >
                        <Link to="/contact">Kontak</Link>
                        <span
                            className="h-[0.15em] w-0 bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/contact:w-[3.15em]"></span>
                    </div>
                    <div
                        className="group/portfolio flex"
                        onClick={handleClickHiddenNav}
                    >
                        <Link to="/portopolio">Portfolio</Link>
                        <span
                            className="h-[0.15em] w-0 bg-teal-500 absolute duration-500 ease-in-out translate-y-6 bg-gradient-to-r from-blue-500 to-blue-700
                         group-hover/portfolio:w-[3.95em]"></span>
                    </div>
                </div>
            </nav>

        </>
    );
}

export default NavigationBar;
