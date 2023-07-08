import React, {useState} from "react";
import {Link} from "react-scroll";

const Nav = () => {
    const [showNav, setShowNav] = useState(false);

    const handleNavBar = () => {
        setShowNav(!showNav);
    };

    const closeNavBar = () => {
        setShowNav(false);
    };

    console.log(showNav);

    return (
        <>
            <nav
                className="fixed w-full h-[70px] sm:h-[80px] bg-gradient-to-r from-primaryColor to-sky-300 sm:bg-gradient-to-r sm:from-white sm:to-white">
                <div
                    className="flex flex-row justify-between items-center sm:flex sm:flex-row h-full sm:px-16 justify-items-center">
                    <Link
                        activeClass="active"
                        to="/"
                        spy={true}
                        smooth={true}
                        duration={500}
                        className="flex items-center text-sm h-full py-6 px-5 font-bold text-white md:h-7 md:text-lg lg:text-2xl sm:h-4 sm:bg-gradient-to-r sm:from-primaryColor sm:to-sky-300  hover:cursor-pointer "
                    >
                        Dimas Febriyanto
                    </Link>
                    <div
                        className={`${showNav ? "fixed mt-[360px] bg-white w-full " : "hidden"}  sm:w-min sm:relative sm:flex`}>
                        <ul className="space-y-7 p-7 space-x-0 border-red-500 flex flex-col sm:py-0 sm:flex-row sm:p-3 sm:space-y-0 sm:space-x-3 md:space-x-11">
                            <li>
                                <Link
                                    activeClass="active"
                                    to="/"
                                    onClick={closeNavBar}
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    className="active:border-b-2 active:border-b-gray-900 hover:border-b-2 hover:border-b-gray-900 font-bold hover:cursor-pointer"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    activeClass="active"
                                    to="about"
                                    onClick={closeNavBar}
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    className="active:border-b-2 active:border-b-gray-900 hover:border-b-2 hover:border-b-gray-900 font-bold hover:cursor-pointer"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    activeClass="active"
                                    to="skill"
                                    onClick={closeNavBar}
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    className="active:border-b-2 active:border-b-gray-900 hover:border-b-2 hover:border-b-gray-900 font-bold hover:cursor-pointer"
                                >
                                    Skill
                                </Link>
                            </li>
                            <li>
                                <Link
                                    activeClass="active"
                                    to="porto"
                                    onClick={closeNavBar}
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    className="active:border-b-2 active:border-b-gray-900 hover:border-b-2 hover:border-b-gray-900 font-bold hover:cursor-pointer"
                                >
                                    Porto
                                </Link>
                            </li>
                            <li>
                                <Link
                                    activeClass="active"
                                    to="contact"
                                    spy={true}
                                    onClick={closeNavBar}
                                    smooth={true}
                                    offset={50}
                                    duration={500}
                                    className="font-bold hover:cursor-pointer bg-black p-2 sm:p-5 text-white"
                                >
                  <span className="active:border-b-2 active:border-b-white  hover:border-b-2 hover:border-b-white">
                    Contact
                  </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div
                        onClick={handleNavBar}
                        className="text-lg sm:hidden"
                    >
            <span
                className={`p-2 font-semibold mr-3 ${showNav ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white '}`}>
              Menu
            </span>
                    </div>
                </div>
                <hr className="hidden sm:block border-black border-solid border-[1px] mx-5"/>
            </nav>
        </>
    );
};

export default Nav;
