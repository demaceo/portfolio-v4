/* eslint-disable react/display-name */
"use client";

import "./NavBar.css";
import { ASSET_PATHS } from "@/lib/constants/paths";
import { useState, memo, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/dist/client/link";

const NavBar = memo(() => {
  const location = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 20) return;

      if (currentScrollY - lastScrollY > 30) {
        setShowNavbar(false);
      } else if (lastScrollY - currentScrollY > 10) {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`nav-container ${showNavbar ? "visible" : "hidden"}`}>
      <Link href="/" className="logo-container" onClick={closeMenu}>
        <Image
          className="logo"
          alt="portfolio-logo"
          src={`${ASSET_PATHS.LOGOS}/logo(light).png`}
          width={50}
          height={50}
        />
        <div className="descriptor-container">
          <div className="name">Demaceo Vincent</div>
          <div className="occupation">Developer | Designer </div>
        </div>
      </Link>

      <div className="dropdown">
        <button
          className="dropbtn"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
        >
          <i
            className={`fa fa-${isMenuOpen ? "close" : "bars"}`}
            id="nav-icon"
          ></i>
        </button>

        <nav
          id="nav-menu"
          className={`nav-links-container${isMenuOpen ? "-open" : ""}`}
        >
          <Link
            href="/mindset"
            className={`nav-link ${
              location === "/mindset" ? "active-link" : ""
            }`}
            onClick={closeMenu}
          >
            MINDSET{" "}
          </Link>
          <Link
            href="/skillset"
            className={`nav-link ${
              location === "/skillset" ? "active-link" : ""
            }`}
            onClick={closeMenu}
          >
            SKILLSET
          </Link>

          <Link
            href="/projects"
            className={`nav-link ${
              location === "/projects" ? "active-link" : ""
            }`}
            onClick={closeMenu}
          >
            PROJECTS
          </Link>
          {/* <Link
            to="/resume"
            className={`nav-link ${
              location.pathname === "/resume" ? "active-link" : ""
            }`}
            onClick={closeMenu}
          >
            XP
          </Link> */}
        </nav>
      </div>
    </header>
  );
});

export default NavBar;
