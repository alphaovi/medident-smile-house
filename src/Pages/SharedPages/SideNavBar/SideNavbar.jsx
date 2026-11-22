
import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Outlet } from "react-router";

import medidentLogo from "../../../assets/logo/medidentLogo.png";

import navItems from "./menuItems";
import DesktopSidebar from "./components/DesktopSlidebar";
import MobileSidebar from "./components/MobileSidebar";
import Navbar from "./components/Navbar";



const SideNavbar = () => {
  const sidebarRef = useRef(null);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close Desktop Submenus on Mouse Leave
  const handleMouseLeave = () => {
    if (sidebarRef.current) {
      const openDetails =
        sidebarRef.current.querySelectorAll("details[open]");

      openDetails.forEach((detail) => {
        detail.removeAttribute("open");
      });
    }
  };

  // Bin Menu Item
  const binItem = {
    name: "Bin",
    icon: <Trash2 className="size-5 shrink-0" />,
    link: "/bin",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-base-100">

      {/* Desktop Sidebar */}
      <DesktopSidebar
        navItems={navItems}
        binItem={binItem}
        sidebarRef={sidebarRef}
        handleMouseLeave={handleMouseLeave}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        navItems={navItems}
        binItem={binItem}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0">

        {/* Navbar */}
        <Navbar
          logo={medidentLogo}
          setIsMobileOpen={setIsMobileOpen}
        />
        

        {/* Page Content */}
        <div className="m-5">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default SideNavbar;
