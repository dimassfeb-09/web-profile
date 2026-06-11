"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface TopNavBarProps {
  cvUrl: string;
  navLinks?: { name: string; href: string }[];
}

const TopNavBar = ({ cvUrl, navLinks = [] }: TopNavBarProps) => {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const isHome = pathname === "/";
  const isInitialJumping = React.useRef(false);

  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Always show navbar on route change and sync scroll position
  React.useEffect(() => {
    setIsVisible(true);
    if (typeof window !== "undefined") {
      setLastScrollY(window.scrollY);
    }
  }, [pathname]);

  // Instantly jump to hash on initial page load / route change from another page
  React.useEffect(() => {
    if (typeof window === "undefined" || !isHome) return;

    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.substring(1);

    let attempts = 0;
    const interval = setInterval(() => {
      const element = document.getElementById(id);
      if (element) {
        clearInterval(interval);
        // Jump instantly to the section (behavior: auto)
        isInitialJumping.current = true;
        element.scrollIntoView({ behavior: "auto" });
        setIsVisible(true);
        setTimeout(() => {
          if (typeof window !== "undefined") {
            setLastScrollY(window.scrollY);
          }
          isInitialJumping.current = false;
        }, 150);
      }
      attempts++;
      if (attempts > 30) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pathname, isHome]);

  // Show/Hide on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      if (isInitialJumping.current) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      // Always show at the very top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (
        currentScrollY > lastScrollY &&
        currentScrollY > 100 &&
        !isMobileMenuOpen
      ) {
        // Scrolling down & not at the top & mobile menu not open -> hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  React.useEffect(() => {
    // 1. Handle Hash Change (Manual Clicks)
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    // 2. Scroll Spy (Intersection Observer)
    let observer: IntersectionObserver | null = null;

    if (isHome && typeof window !== "undefined") {
      const sectionIds = navLinks
        .filter((link) => link.href.startsWith("#"))
        .map((link) => link.href.substring(1));

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
        },
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

  // Dynamic Browser Tab Title based on active section
  React.useEffect(() => {
    if (!isHome || typeof window === "undefined") return;

    if (!activeHash || activeHash === "#hero") {
      document.title = "Dimas Febriyanto — Fullstack & Mobile Developer (Golang + Flutter)";
      return;
    }

    const activeLink = navLinks.find((link) => link.href === activeHash);
    if (activeLink) {
      document.title = `${activeLink.name} | Dimas Febriyanto`;
    }
  }, [activeHash, isHome, navLinks]);

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
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
    const isPathMatch =
      pathname === href || (href !== "/" && pathname.startsWith(href));
    if (href === "/" || href === "") {
      return isPathMatch && !hasActiveHash;
    }
    return isPathMatch;
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-200/50 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="flex justify-between items-center px-4 xs:px-6 py-4 xs:py-5 max-w-screen-2xl mx-auto relative z-50">
          <Link
            className="text-lg xs:text-xl font-black tracking-tighter text-zinc-900 font-headline transition-all duration-300 ease-in-out hover:opacity-80 scale-95 active:scale-90 transition-transform"
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {isHome && activeHash && activeHash !== "#hero" ? (
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-400 font-normal">Dimas</span>
                <span className="text-zinc-300 font-normal">/</span>
                <span className="text-primary font-black">
                  {navLinks.find((l) => l.href === activeHash)?.name || ""}
                </span>
              </span>
            ) : (
              "Dimas Febriyanto"
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8 font-plus-jakarta text-sm font-medium tracking-tight">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isHash = link.href.startsWith("#");
              const linkProps = {
                className: `transition-all duration-300 ease-in-out hover:opacity-80 border-b-2 py-1 ${
                  active
                    ? "text-primary border-primary"
                    : "text-zinc-500 border-transparent hover:text-zinc-900 hover:border-primary/30"
                }`,
                href: getHref(link.href),
                onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (isHash) {
                    if (isHome) {
                      e.preventDefault();
                      setActiveHash(link.href);
                      const targetEl = document.querySelector(link.href);
                      if (targetEl) {
                        targetEl.scrollIntoView({ behavior: "smooth" });
                      }
                      window.history.pushState(null, "", link.href);
                    } else {
                      setActiveHash(link.href);
                    }
                  } else {
                    setActiveHash("");
                  }
                },
              };

              return isHash ? (
                <a key={link.name} {...linkProps}>
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} {...linkProps}>
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Resume Button */}
          <a
            className="hidden lg:flex items-center justify-center px-4 xs:px-6 py-2 xs:py-2.5 rounded-full bg-primary text-white font-label font-medium text-xs xs:text-sm tracking-wide transition-all duration-300 ease-in-out hover:opacity-90 scale-95 active:scale-90 transition-transform hover:shadow-[0_8px_24px_rgb(0,62,199,0.22)]"
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-full hover:bg-zinc-100 transition-colors focus:outline-none relative z-50"
            aria-label="Toggle Menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`h-0.5 w-full bg-zinc-800 rounded transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "rotate-45 translate-y-[8px]" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-zinc-800 rounded transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "w-0 opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 w-full bg-zinc-800 rounded transition-all duration-300 origin-center ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-[8px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Premium Under-Navbar Mobile Menu Overlay with Clipping Boundary */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[61px] xs:top-[69px] z-40 overflow-hidden lg:hidden ${
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`w-full h-full bg-white/98 backdrop-blur-3xl flex flex-col justify-between px-6 py-6 xs:px-8 xs:py-8 ${
            isMobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
          style={{
            transition:
              "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Spacious Center Navigation Link Stack */}
          <div className="flex flex-col gap-6 xs:gap-8 my-auto pl-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isHash = link.href.startsWith("#");
              const linkProps = {
                className: `text-xl xs:text-2xl font-bold font-headline tracking-tight transition-all duration-300 flex items-center gap-4 ${
                  active
                    ? "text-primary translate-x-2"
                    : "text-zinc-400 hover:text-zinc-950 hover:translate-x-1"
                }`,
                href: getHref(link.href),
                onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
                  setIsMobileMenuOpen(false);
                  if (isHash) {
                    if (isHome) {
                      e.preventDefault();
                      setActiveHash(link.href);
                      const targetEl = document.querySelector(link.href);
                      if (targetEl) {
                        targetEl.scrollIntoView({ behavior: "smooth" });
                      }
                      window.history.pushState(null, "", link.href);
                    } else {
                      setActiveHash(link.href);
                    }
                  } else {
                    setActiveHash("");
                  }
                },
              };

              return isHash ? (
                <a key={link.name} {...linkProps}>
                  {active && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} {...linkProps}>
                  {active && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Bottom Call-To-Action & Status */}
          <div className="flex flex-col gap-5 border-t border-zinc-100 pt-6">
            <div className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-500 tracking-wide">
                Available for opportunities
              </span>
            </div>
            <a
              className="w-full py-4 rounded-full bg-primary text-white font-label font-bold text-center tracking-wide shadow-[0_8px_24px_rgb(0,62,199,0.2)] active:scale-95 transition-transform duration-200"
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Resume
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavBar;
