
import NavMenu from "./NavMenu";

const DesktopSidebar = ({
  navItems,
  binItem,
  sidebarRef,
  handleMouseLeave,
}) => {
  return (
    <aside
      ref={sidebarRef}
      onMouseLeave={handleMouseLeave}
      className="hidden md:flex group z-25 flex-col bg-[#3a5ede] w-16 hover:w-64 transition-all duration-300 ease-in-out shadow-lg overflow-hidden justify-between h-full shrink-0"
    >

      {/* Main Menu */}
      <div className="w-64 flex flex-col grow overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

        <ul className="menu w-full p-2 space-y-1 pt-6">

          <NavMenu items={navItems} />

        </ul>

      </div>

      {/* Bottom Fixed Bin Item */}
      <div className="w-64 shrink-0 bg-[#4464D8] border-t border-base-300">

        <ul className="menu w-full p-2">

          <NavMenu items={[binItem]} />

        </ul>

      </div>

    </aside>
  );
};

export default DesktopSidebar;
