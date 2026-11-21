
import { X } from "lucide-react";
import NavMenu from "./NavMenu";

const MobileSidebar = ({
  navItems,
  binItem,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-base-200 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="flex flex-col grow overflow-hidden">

          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300 shrink-0">

            <span className="font-bold text-lg">
              Medident
            </span>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-md hover:bg-base-300 transition-colors"
              aria-label="Close Menu"
            >
              <X className="size-6" />
            </button>

          </div>

          {/* Main Menu */}
          <ul className="menu w-full p-4 space-y-1 grow overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

            <NavMenu
              items={navItems}
              isMobile={true}
              onNavigate={() => setIsMobileOpen(false)}
            />

          </ul>

        </div>

        {/* Bottom Fixed Bin Item */}
        <div className="w-full shrink-0 bg-base-200 border-t border-base-300">

          <ul className="menu w-full p-4">

            <NavMenu
              items={[binItem]}
              isMobile={true}
              onNavigate={() => setIsMobileOpen(false)}
            />

          </ul>

        </div>

      </aside>
    </>
  );
};

export default MobileSidebar;
