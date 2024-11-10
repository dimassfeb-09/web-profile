import React, { useState } from "react";
import Drawer from "../components/ui/drawer";
import { Button } from "../components/ui/button";
import { Trophy } from "lucide-react";

interface DefaultLayoutProps {
  className?: string;
  children: React.ReactNode;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  const [isDrawerActive, setIsDrawerActive] = useState(false);

  const scrollToId = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault(); // Prevent default anchor behavior
    const element = document.getElementById(id);

    if (element) {
      const offset = 80; // Set the desired offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  return (
    <div className="bg-bg">
      <nav className="fixed left-0 top-0 z-20 mx-auto flex h-[88px] w-full items-center border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack px-5 m500:h-16 ">
        <div className="mx-auto flex w-[1300px] dark:text-darkText text-text max-w-full items-center justify-between">
          <div className="hidden w-[172px] m900:block m800:w-[44px] m400:w-9">
            <button className="flex items-center justify-center rounded-base border-2 border-border dark:border-darkBorder p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu h-6 w-6 m500:h-4 m500:w-4"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="sm:hidden">
            <Button onClick={() => setIsDrawerActive(!isDrawerActive)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu h-6 w-6 m500:h-4 m500:w-4"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </Button>
          </div>
          <div className="flex items-center gap-10">
            <a
              className="hidden sm:block sm:text-4xl w-[172px] m900:w-[unset] font-heading m500:text-xl"
              href="/"
            >
              DIMAS FEBRIYANTO
            </a>
          </div>
          <div className="hidden lg:flex items-center gap-10 m900:hidden">
            <a
              className="text-xl font-base hover:cursor-pointer"
              onClick={(e) => scrollToId(e, "home")}
            >
              Home
            </a>

            <a
              className="text-xl font-base hover:cursor-pointer flex items-center gap-2"
              onClick={(e) => scrollToId(e, "what-i-do")}
            >
              What I Do
            </a>
            <a
              className="text-xl font-base hover:cursor-pointer"
              onClick={(e) => scrollToId(e, "my-projects")}
            >
              Projects
            </a>

            <a
              className="text-xl font-base hover:cursor-pointer flex items-center gap-2"
              onClick={(e) => scrollToId(e, "my-achievement")}
            >
              <Trophy className="text-yellow-600" /> Achievement
            </a>
            <a
              className="text-xl font-base hover:cursor-pointer"
              onClick={(e) => scrollToId(e, "contact")}
            >
              Contact
            </a>
          </div>
          <a href="https://github.com/dimassfeb-09" target="_blank">
            <Button onClick={() => {}}>
              <svg
                className="h-6 w-6 m500:h-4 m500:w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 512"
              >
                <path
                  className="fill-text dark:fill-darkText"
                  d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                ></path>
              </svg>
            </Button>
          </a>
        </div>
        <Drawer active={isDrawerActive} setActive={setIsDrawerActive}>
          <a
            className="block w-full text-text border-b-2 border-border dark:border-darkBorder bg-main px-5 py-4 hover:bg-mainAccent"
            onClick={(e) => {
              scrollToId(e, "home");
              setIsDrawerActive(false);
            }}
          >
            Home
          </a>
          <a
            className="block w-full text-text border-b-2 border-border dark:border-darkBorder bg-main px-5 py-4 hover:bg-mainAccent"
            onClick={(e) => {
              scrollToId(e, "what-i-do");
              setIsDrawerActive(false);
            }}
          >
            What I Do
          </a>

          <a
            className="block w-full text-text border-b-2 border-border dark:border-darkBorder bg-main px-5 py-4 hover:bg-mainAccent"
            onClick={(e) => {
              scrollToId(e, "my-projects");
              setIsDrawerActive(false);
            }}
          >
            Projects
          </a>

          <a
            className="block w-full text-text border-b-2 border-border dark:border-darkBorder bg-main px-5 py-4 hover:bg-mainAccent"
            onClick={(e) => {
              scrollToId(e, "my-achievement");
              setIsDrawerActive(false);
            }}
          >
            Achievements
          </a>

          <a
            className="block w-full text-text border-b-2 border-border dark:border-darkBorder bg-main px-5 py-4 hover:bg-mainAccent"
            onClick={(e) => {
              scrollToId(e, "contact");
              setIsDrawerActive(false);
            }}
          >
            Contact
          </a>
        </Drawer>
      </nav>
      <div>{children}</div>
      <footer className="z-30 border-t-4 border-border dark:border-darkBorder bg-white dark:bg-secondaryBlack px-5 py-5 text-center font-base m500:text-sm">
        Dimas Febriyanto - 2024.
      </footer>
    </div>
  );
};
