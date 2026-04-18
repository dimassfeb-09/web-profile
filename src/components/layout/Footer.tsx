import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full mt-12 xs:mt-16 lg:mt-24 bg-gradient-to-br from-blue-50/50 via-white to-white border-t border-zinc-200/20 flat">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 xs:px-12 py-10 xs:py-12 lg:py-16 max-w-7xl mx-auto gap-8">
        <p className="font-space-grotesk text-xs uppercase tracking-widest text-zinc-500 opacity-70 hover:opacity-100 duration-500">
          © 2026 Dimas Febriyanto. Engineered for the web.
        </p>
        <div className="flex gap-6 font-space-grotesk text-xs uppercase tracking-widest">
          <a
            className="text-zinc-500 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-300 transition-colors opacity-70 hover:opacity-100 duration-500"
            href="#"
          >
            GitHub
          </a>
          <a
            className="text-zinc-500 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-300 transition-colors opacity-70 hover:opacity-100 duration-500"
            href="https://www.linkedin.com/in/dimassfeb/"
          >
            LinkedIn
          </a>
          <a
            className="text-zinc-500 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-300 transition-colors opacity-70 hover:opacity-100 duration-500"
            href="#"
          >
            Source Code
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
