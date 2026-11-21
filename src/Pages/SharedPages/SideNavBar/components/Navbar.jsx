
import { Menu } from "lucide-react";

const Navbar = ({ logo, setIsMobileOpen }) => {
  return (
    <nav className="navbar h-16 w-full bg-[#4464d8] border-b border-base-200 px-4 flex items-center gap-3 shrink-0">

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-base-200 transition-colors"
        aria-label="Open Menu"
      >
        <Menu className="size-6" />
      </button>

      {/* Logo */}
      <div className="font-bold text-lg">

        <img
          src={logo}
          alt="Medident Logo"
          className="h-10 w-auto object-contain"
        />

      </div>

    </nav>
  );
};

export default Navbar;
