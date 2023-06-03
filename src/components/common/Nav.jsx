import React from "react";

const Nav = () => {
  return (
    <>
      <nav className="fixed w-full h-[90px] bg-white">
        <div className="flex flex-row h-full justify-between px-16 items-center justify-items-center">
          <div className="h-7 font-bold text-2xl">Dimas Febriyanto</div>
          <div>
            <ul className="flex flex-row p-3 space-x-11">
              <li>
                <a
                  onClick={() => {
                    console.log("asdgasd");
                  }}
                  className="active:border-b-2 active:border-b-gray-900 hover:border-b-2 hover:border-b-gray-900 font-bold"
                >
                  Home
                </a>
              </li>
              <li className="hover:border-b-2 hover:border-b-gray-900 font-bold ">
                About
              </li>
              <li className="hover:border-b-2 hover:border-b-gray-900 font-bold">
                Skill
              </li>
              <li className="hover:border-b-2 hover:border-b-gray-900 font-bold">
                Porto
              </li>
              <li className="hover:border-b-2 hover:border-b-gray-900 font-bold">
                Contact
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-black border-solid border-[1px] mx-14" />
      </nav>
    </>
  );
};

export default Nav;
