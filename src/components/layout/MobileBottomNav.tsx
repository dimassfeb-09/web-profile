"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  name: string;
  href: string;
}

interface MobileBottomNavProps {
  navLinks: NavLink[];
}

const MobileBottomNav = ({ navLinks }: MobileBottomNavProps) => {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(true);
  const [showHint, setShowHint] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const isHome = pathname === "/";
  const itemRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});

  // Hide hint after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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

  // Auto-scroll active item into view
  React.useEffect(() => {
    const activeLink = navLinks.find((link) => isActive(link.href));
    if (activeLink) {
      const activeEl = itemRefs.current[activeLink.name];
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeHash, pathname]);

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

  const getHref = (href: string) => {
    if (href.startsWith("#")) {
      return isHome ? href : `/${href}`;
    }
    return href;
  };

  const isActive = (href: string) => {
    const currentHash = activeHash;
    const hasActiveHash = currentHash.length > 0;

    // 1. Handle Hash Links
    if (href.includes("#")) {
      const [, hash] = href.split("#");
      const targetHash = `#${hash}`;
      return isHome && currentHash === targetHash;
    }

    // 2. Handle Path Links
    const isPathMatch =
      pathname === href || (href !== "/" && pathname.startsWith(href));

    if (href === "/" || href === "") {
      return isPathMatch && !hasActiveHash;
    }

    return isPathMatch;
  };

  return (
    <nav
      className={`fixed bottom-6 left-4 right-4 z-[100] lg:hidden flex flex-col items-center gap-3 transition-all duration-500 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"
      }`}
    >
      {/* Floating Tooltip Hint */}
      <div
        className={`px-3 py-1 bg-zinc-900/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl transition-all duration-700 ${
          showHint
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 scale-90 pointer-events-none"
        }`}
      >
        Navigate
      </div>

      {/* Floating Container with Glassmorphism and Glow */}
      <div
        className={`relative w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-zinc-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden transition-shadow duration-700 ${
          activeHash ? "shadow-primary/10" : ""
        }`}
      >
        {/* Subtle top accent line (animated glow) */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse" />

        {/* Links Container */}
        <div className="flex items-center overflow-x-auto hide-scrollbar py-2.5">
          <div className="flex items-center gap-1 xs:gap-1.5 px-4 m-auto">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isHash = link.href.includes("#");
              const indicator = isHash ? "#" : "/";

              return (
                <Link
                  key={link.name}
                  ref={(el) => {
                    itemRefs.current[link.name] = el;
                  }}
                  href={getHref(link.href)}
                  onClick={() => {
                    if (isHash) {
                      const hash = link.href.split("#")[1];
                      setActiveHash(hash ? `#${hash}` : "");
                    } else {
                      setActiveHash("");
                    }
                  }}
                  className={`
                    relative flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap
                    transition-all duration-300 ease-out select-none
                    ${
                      active
                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105 z-10"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80 active:scale-95"
                    }
                  `}
                >
                  {/* Route type indicator */}
                  <span
                    className={`text-[9px] font-mono leading-none opacity-50 ${
                      active ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {indicator}
                  </span>

                  <span
                    className={`text-[13px] font-bold tracking-tight ${active ? "font-bold" : "font-medium"}`}
                  >
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
