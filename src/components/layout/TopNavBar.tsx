'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface TopNavBarProps {
  cvUrl: string;
  navLinks?: { name: string; href: string }[];
}

const TopNavBar = ({ cvUrl, navLinks = [] }: TopNavBarProps) => {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = React.useState('');
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const isHome = pathname === '/';

  // Show/Hide on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      
      const currentScrollY = window.scrollY;
      
      // Always show at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & not at the top -> hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  React.useEffect(() => {
    // 1. Handle Hash Change (Manual Clicks)
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    // 2. Scroll Spy (Intersection Observer)
    let observer: IntersectionObserver | null = null;
    
    if (isHome && typeof window !== "undefined") {
      const sectionIds = navLinks
        .filter(link => link.href.startsWith("#"))
        .map(link => link.href.substring(1));

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              setActiveHash(`#${id}`);
            }
          });
        },
        {
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        }
      );

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer?.observe(element);
      });
    }

    // Initial sync
    if (typeof window !== "undefined") {
      setActiveHash(window.location.hash);
      window.addEventListener("hashchange", handleHashChange);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("hashchange", handleHashChange);
      }
      observer?.disconnect();
    };
  }, [isHome, navLinks]);

  const getHref = (href: string) => {
    if (href.startsWith('#')) {
      return isHome ? href : `/${href}`;
    }
    return href;
  };

  const isActive = (href: string) => {
    const hasActiveHash = activeHash.length > 0;

    // Handle Hash Links
    if (href.includes("#")) {
      const [, hash] = href.split("#");
      return isHome && activeHash === `#${hash}`;
    }

    // Handle Path Links
    const isPathMatch = pathname === href || (href !== "/" && pathname.startsWith(href));
    if (href === "/" || href === "") {
      return isPathMatch && !hasActiveHash;
    }
    return isPathMatch;
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out bg-white/95 backdrop-blur-xl border-b border-zinc-200/50 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center px-6 xs:px-8 py-4 xs:py-6 max-w-screen-2xl mx-auto relative z-50">
        <Link
          className="text-lg xs:text-xl font-black tracking-tighter text-zinc-900 font-headline transition-all duration-300 ease-in-out hover:opacity-80 scale-95 active:scale-90 transition-transform"
          href="/"
        >
          Dimas Febriyanto
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 font-plus-jakarta text-sm font-medium tracking-tight">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                className={`transition-all duration-300 ease-in-out hover:opacity-80 border-b-2 py-1 ${
                  active 
                    ? 'text-primary border-primary' 
                    : 'text-zinc-500 border-transparent hover:text-zinc-900 hover:border-primary/30'
                }`}
                href={getHref(link.href)}
                onClick={() => {
                  if (link.href.startsWith("#")) {
                    setActiveHash(link.href);
                  } else {
                    setActiveHash("");
                  }
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <a
          className="flex items-center justify-center px-4 xs:px-6 py-2 xs:py-2.5 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-label font-medium text-xs xs:text-sm tracking-wide transition-all duration-300 ease-in-out hover:opacity-90 scale-95 active:scale-90 transition-transform hover:shadow-[0_8px_30px_rgb(0,62,199,0.2)]"
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      </div>
    </nav>
  );
};

export default TopNavBar;
