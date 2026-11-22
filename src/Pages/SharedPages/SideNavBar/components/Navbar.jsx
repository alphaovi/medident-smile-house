import { useEffect, useRef, useState } from "react";
import { Menu, Settings, LogOut, LogIn, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { clearAuthSession, getStoredUser } from "../../../../services/auth/api";
import { useAuth } from "../../../../Contexts/AuthContext";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=0b7ad8&color=ffffff&size=128";

const Navbar = ({ logo, setIsMobileOpen }) => {
  const { user: contextUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeUser, setActiveUser] = useState(() => getStoredUser() || contextUser || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const syncUser = () => {
      const latestStored = getStoredUser();
      setActiveUser(latestStored || contextUser || null);
    };

    syncUser();
    window.addEventListener("auth-change", syncUser);
    const interval = setInterval(syncUser, 300);

    return () => {
      window.removeEventListener("auth-change", syncUser);
      clearInterval(interval);
    };
  }, [contextUser]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout?.();
    clearAuthSession();
    setActiveUser(null);
    navigate("/login", { replace: true });
  };

  const handleSettings = () => {
    setDropdownOpen(false);
    navigate("/settings");
  };

  const avatarSrc =
    activeUser?.avatar ||
    activeUser?.photoURL ||
    activeUser?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      activeUser?.name || activeUser?.email || "User"
    )}&background=0b7ad8&color=ffffff&size=128`;

  return (
    <nav className="navbar h-16 w-full bg-[#4464d8] text-white border-b border-white/15 px-4 flex items-center justify-between gap-3 shrink-0 relative z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="size-6" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src={logo}
            alt="Medident Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="ml-auto flex items-center gap-3" ref={dropdownRef}>
        {!activeUser ? (
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#1e3a8a] hover:bg-sky-50 text-xs font-bold tracking-wide uppercase shadow-sm transition"
          >
            <LogIn className="w-4 h-4" />
            <span>Login / Sign Up</span>
          </Link>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
              aria-expanded={dropdownOpen}
              aria-haspopup="menu"
            >
              <img
                src={avatarSrc || DEFAULT_AVATAR}
                alt={activeUser?.name || "Profile"}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shrink-0"
              />
              <span className="hidden sm:inline text-xs font-medium text-white max-w-[130px] truncate">
                {activeUser?.name || activeUser?.email}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/90 transition-transform duration-150 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-52 bg-white text-slate-700 rounded-md shadow-xl border border-slate-200 py-1.5 z-50"
              >
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {activeUser?.name || "User"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {activeUser?.email || ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSettings}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-[#1588d8] flex items-center gap-2.5 transition"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;