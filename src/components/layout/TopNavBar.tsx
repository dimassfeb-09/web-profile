'use client';

import React, { useState, useEffect } from 'react';

const TopNavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState('#');

  useEffect(() => {
    const fetchCv = async () => {
      try {
        const res = await fetch('/api/home');
        const json = await res.json();
        if (json.status === 200 && json.data.cv_url) {
          setCvUrl(json.data.cv_url);
        }
      } catch (err) {
        console.error('Failed to fetch CV link in Navbar:', err);
      }
    };
    fetchCv();
  }, []);

  useEffect(() => {
    // Robust scroll lock for mobile devices
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
      // Adding touch-action: none to prevent iOS rubber-banding scroll
      document.body.style.touchAction = 'none';
    } else {
      document.body.classList.remove('overflow-hidden');
      document.body.style.touchAction = 'auto';
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
      document.body.style.touchAction = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isMenuOpen 
          ? 'bg-white border-b border-zinc-100' 
          : 'bg-white/95 backdrop-blur-xl border-b border-zinc-200/50'
      }`}
    >
      <div className="flex justify-between items-center px-6 xs:px-8 py-4 xs:py-6 max-w-screen-2xl mx-auto relative z-50">
        <a
          className="text-lg xs:text-xl font-black tracking-tighter text-zinc-900 font-headline transition-all duration-300 ease-in-out hover:opacity-80 scale-95 active:scale-90 transition-transform"
          href="#"
          onClick={() => setIsMenuOpen(false)}
        >
          Dimas Febriyanto
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 font-plus-jakarta text-sm font-medium tracking-tight">
          {navLinks.map((link) => (
            <a
              key={link.name}
              className="text-zinc-500 hover:text-zinc-900 transition-all duration-300 ease-in-out hover:opacity-80"
              href={link.href}
            >
              {link.name}
            </a>
          ))}
        </div>

        <a
          className="hidden lg:flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-label font-medium text-sm tracking-wide transition-all duration-300 ease-in-out hover:opacity-90 scale-95 active:scale-90 transition-transform hover:shadow-[0_8px_30px_rgb(0,62,199,0.2)]"
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>

        {/* Hamburger Button */}
        <button 
          className="lg:hidden text-zinc-900 focus:outline-none" 
          onClick={toggleMenu} 
          aria-label="Toggle Menu"
        >
          <span className="material-symbols-outlined text-2xl xs:text-3xl select-none">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay (Absolute Push-Down) */}
      <div
        className={`absolute top-full left-0 w-full bg-white transition-all duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isMenuOpen 
            ? 'h-[calc(100dvh-70px)] opacity-100' 
            : 'h-0 opacity-0 pointer-events-none'
        }`}
        style={{ borderTop: isMenuOpen ? '1px solid #f4f4f5' : 'none' }}
      >
        <div className="flex flex-col items-center justify-center min-h-full py-10 xs:py-12 gap-6 xs:gap-8 px-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              className="text-xl xs:text-2xl font-headline font-bold text-zinc-900 hover:text-primary transition-colors text-center w-full"
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            className="mt-4 w-full flex items-center justify-center px-8 py-3.5 xs:py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-label font-medium text-base xs:text-lg tracking-wide shadow-lg shadow-primary/20"
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
