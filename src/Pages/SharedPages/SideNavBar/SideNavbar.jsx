import { useRef, useState } from "react";
import {
  LayoutDashboard,
  PackageSearch,
  PackagePlus,
  Boxes,
  PackageX,
  Users,
  UserPlus,
  UserCheck,
  ShoppingCart,
  FilePlus,
  ClipboardList,
  RotateCcw,
  BadgeDollarSign,
  Receipt,
  ListOrdered,
  Landmark,
  BarChart3,
  Settings,
  Menu,
  X,
  Trash2,
} from "lucide-react";
import { Outlet, NavLink } from "react-router";

const SideNavbar = () => {
  const sidebarRef = useRef(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMouseLeave = () => {
    if (sidebarRef.current) {
      const openDetails = sidebarRef.current.querySelectorAll("details[open]");
      openDetails.forEach((detail) => detail.removeAttribute("open"));
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <LayoutDashboard className="size-5 shrink-0" />,
    },
    {
      name: "Manage Product",
      icon: <PackageSearch className="size-5 shrink-0" />,
      children: [
        {
          name: "Add Product",
          icon: <PackagePlus className="size-4 shrink-0" />,
          link: "/manage-product/add-product",
        },
        
        {
          name: "Store",
          icon: <Boxes className="size-4 shrink-0" />,
          link: "/manage-product/store",
        },
        {
          name: "Lost Items",
          icon: <PackageX className="size-4 shrink-0" />,
          link: "/manage-product/lost-items",
        },
      ],
    },
    {
      name: "Manage Customers",
      icon: <Users className="size-5 shrink-0" />,
      link: "/manage-customers"
    },
    {
      name: "Purchase",
      icon: <ShoppingCart className="size-5 shrink-0" />,
      children: [
        {
          name: "Purchase Order",
          icon: <FilePlus className="size-4 shrink-0" />,
          link: "/purchase/purchase-order",
        },
       
        {
          name: "Purchase Return",
          icon: <RotateCcw className="size-4 shrink-0" />,
          link: "/purchase/purchase-return",
        },
      ],
    },
    {
      name: "Sell",
      icon: <BadgeDollarSign className="size-5 shrink-0" />,
      children: [
        {
          name: "Sell Order",
          icon: <Receipt className="size-4 shrink-0" />,
          link: "/sell/sell-order",
        },
        {
          name: "Order List",
          icon: <ListOrdered className="size-4 shrink-0" />,
          link: "/sell/order-list",
        },
      ],
    },
    {
      name: "Finance",
      icon: <Landmark className="size-5 shrink-0" />,
      link: "/finance",
    },
    {
      name: "Reports",
      icon: <BarChart3 className="size-5 shrink-0" />,
      link: "/reports",
    },
    {
      name: "Settings",
      icon: <Settings className="size-5 shrink-0" />,
      link: "/settings",
    },
  ];

  const binItem = {
    name: "Bin",
    icon: <Trash2 className="size-5 shrink-0" />,
    link: "/bin",
  };

  // Dynamic Multi-level Recursive Menu Renderer
  const renderNavList = (items, isMobile = false) => {
    return items.map((item, index) => (
      <li key={index} className="w-full">
        {item.children && item.children.length > 0 ? (
          <details
            className={
              !isMobile
                ? "pointer-events-none group-hover:pointer-events-auto"
                : ""
            }
          >
            <summary className="flex items-center justify-between min-h-10 px-3 py-2 hover:bg-base-300 rounded-lg cursor-pointer transition-colors duration-150 list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="shrink-0">{item.icon}</span>
                <span
                  className={`${
                    !isMobile
                      ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                      : "whitespace-nowrap"
                  } font-medium text-sm`}
                >
                  {item.name}
                </span>
              </div>
            </summary>
            <ul
              className={`ml-3 mt-1 border-l-2 border-base-300 pl-2 space-y-1 ${
                !isMobile
                  ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  : ""
              }`}
            >
              {renderNavList(item.children, isMobile)}
            </ul>
          </details>
        ) : (
          <NavLink
            to={item.link || "#"}
            onClick={() => isMobile && setIsMobileOpen(false)}
            className="flex items-center gap-3 min-h-10 px-3 py-2 text-sm text-base-content/80 hover:text-primary rounded-lg whitespace-nowrap hover:bg-base-100 transition-colors duration-150"
          >
            <span className="shrink-0">{item.icon}</span>
            <span
              className={
                !isMobile
                  ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                  : "whitespace-nowrap"
              }
            >
              {item.name}
            </span>
          </NavLink>
        )}
      </li>
    ));
  };

  const renderBinItem = (item, isMobile = false) => (
    <li className="w-full">
      <NavLink
        to={item.link || "#"}
        onClick={() => isMobile && setIsMobileOpen(false)}
        className="flex items-center gap-3 min-h-10 px-3 py-2 text-sm text-base-content/80 hover:text-primary rounded-lg whitespace-nowrap hover:bg-base-100 transition-colors duration-150"
      >
        <span className="shrink-0">{item.icon}</span>
        <span
          className={
            !isMobile
              ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
              : "whitespace-nowrap"
          }
        >
          {item.name}
        </span>
      </NavLink>
    </li>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-base-100">
      {/* ---------------- Desktop Sidebar ---------------- */}
      <aside
        ref={sidebarRef}
        onMouseLeave={handleMouseLeave}
        className="hidden md:flex group z-20 flex-col bg-base-200 w-16 hover:w-64 transition-all duration-300 ease-in-out shadow-lg overflow-hidden justify-between h-full shrink-0"
      >
        <ul className="menu w-full p-2 space-y-1 grow pt-6 primaryColor overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {renderNavList(navItems, false)}
        </ul>

        {/* Bottom Fixed Bin Item */}
        <div className="w-full shrink-0 bg-base-200 border-t border-base-300">
          <ul className="menu w-full p-2 primaryColor">
            {renderBinItem(binItem, false)}
          </ul>
        </div>
      </aside>

      {/* ---------------- Mobile Overlay ---------------- */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* ---------------- Mobile Sidebar Drawer ---------------- */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-base-200 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col grow overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-base-300 shrink-0">
            <span className="font-bold text-lg">Smile House</span>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-md hover:bg-base-300 transition-colors"
            >
              <X className="size-6" />
            </button>
          </div>

          <ul className="menu w-full p-4 space-y-1 grow overflow-y-auto primaryColor [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {renderNavList(navItems, true)}
          </ul>
        </div>

        {/* Bottom Fixed Bin Item (Mobile) */}
        <div className="w-full shrink-0 bg-base-200 border-t border-base-300">
          <ul className="menu w-full p-4 primaryColor">
            {renderBinItem(binItem, true)}
          </ul>
        </div>
      </aside>

      {/* ---------------- Main Content Area ---------------- */}
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
        <nav className="navbar h-16 w-full bg-base-300 border-b border-base-200 px-4 secondaryColor flex items-center gap-3 shrink-0">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-base-200 transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="size-6" />
          </button>

          <div className="font-bold text-lg">Smile House</div>
        </nav>

        <div className="m-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;