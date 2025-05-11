import { LucideSidebarClose, LucideSidebarOpen } from "lucide-react";
import React from "react";
import Logo from "../../assets/icons/Transparent Background 4.svg";
function Header({ open, onMenuClick }) {
  return (
    <header className="h-16 bg-[#f0f4f8] flex items-center px-6 fixed top-0 left-0 right-0 z-30 border-b transition-all duration-300">
      <button
        onClick={onMenuClick}
        className="mr-4 focus:outline-none cursor-pointer"
        aria-label="Open sidebar"
      >
        {open ? (
          <LucideSidebarClose size={28} className="text-[#8691b3]" />
        ) : (
          <LucideSidebarOpen size={28} className="text-[#8691b3]" />
        )}
      </button>

      <img src={Logo} alt="open sidebar" className="h-8 cursor-pointer" />
    </header>
  );
}

export default Header;
