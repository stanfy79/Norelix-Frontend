import { usePrivy } from "@privy-io/react-auth";
import { Menu, X } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const { ready, authenticated } = usePrivy();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation().pathname;
  const paths = [
    "/overview",
    "/payments",
    "/settings",
    "/widget-sdk",
    "/signin",
  ];
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={`fixed mx-auto ${paths.includes(location) ? "hidden" : "flex"} ${!isMenuOpen ? "h-16" : "h-auto"} flex-col w-full md:items-center px-6 py-4 md:py-3 md:flex-row md:px-8 shadow-md backdrop-blur-[10px] bg-[#ffffff8e] z-20 transition-all duration-300 overflow-hidden`}
      >
        <Link to="/">
          <div className="flex items-center gap-3 text-black">
            <span className="inline-flex h-10 w-10 items-center justify-center bg-emerald-500 text-lg font-semibold shadow-lg shadow-emerald-500/30">
              N
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] uppercase text-slate-700">
                Norelix
              </p>
            </div>
          </div>
        </Link>

        <nav className="flex flex-col md:flex-row md:items-center md:ml-9 gap-5 text-[13px] text-black mt-6 md:mt-0">
          <Link
            to="/#features"
            onClick={closeMenu}
            className="transition duration-200 hover:text-slate-900 hover:underline hover:font-bold"
          >
            Features
          </Link>
          <Link
            to="/#developers"
            onClick={closeMenu}
            className="transition duration-200 hover:text-slate-900 hover:underline hover:font-bold"
          >
            Developers
          </Link>
          <Link
            to="/#solutions"
            onClick={closeMenu}
            className="transition duration-200 hover:text-slate-900 hover:underline hover:font-bold"
          >
            Solutions
          </Link>
          <Link
            to="/overview"
            className="transition duration-200 text-emerald-500 hover:text-slate-900 hover:underline font-bold md:hidden"
          >
            Get Started
          </Link>
        </nav>

        <div className="hidden md:flex flex-col md:flex-row items-center gap-3 absolute right-9">
          {ready && !authenticated ? (
            <Link to="/signin">
              <button className="px-4 py-2 text-[13px] text-black transition hover:font-bold hover:underline">
                Login
              </button>
            </Link>
          ) : null}
          <Link to="/overview">
            <button className="text-[13px] font-semibold text-slate-950  brutal-btn">
              Launch App
            </button>
          </Link>
        </div>

        <div className="block md:hidden items-center gap-3 absolute right-6 text-slate-900 hover:text-emerald-500">
          {!isMenuOpen ? (
            <Menu size={30} onClick={() => setIsMenuOpen(true)} />
          ) : (
            <X size={30} onClick={() => setIsMenuOpen(false)} />
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
