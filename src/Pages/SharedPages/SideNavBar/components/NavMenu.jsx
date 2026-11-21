
import { NavLink } from "react-router";

const NavMenu = ({
  items,
  isMobile = false,
  onNavigate,
}) => {
  return (
    <>
      {items.map((item, index) => (
        <li key={`${item.name}-${index}`} className="w-full">

          {item.children && item.children.length > 0 ? (
            <details
              className={
                !isMobile
                  ? "pointer-events-none group-hover:pointer-events-auto w-full overflow-hidden"
                  : "w-full"
              }
            >
              <summary className="flex items-center justify-between min-h-10 px-3 py-2 hover:bg-base-300 rounded-lg cursor-pointer transition-colors duration-150 list-none [&::-webkit-details-marker]:hidden">

                <div className="flex items-center gap-3 overflow-hidden">

                  <span className="shrink-0">
                    {item.icon}
                  </span>

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
                className={`ml-3 mt-1 border-l-2 border-base-300 pl-2 space-y-1 overflow-hidden ${
                  !isMobile
                    ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    : ""
                }`}
              >

                <NavMenu
                  items={item.children}
                  isMobile={isMobile}
                  onNavigate={onNavigate}
                />

              </ul>
            </details>
          ) : (
            <NavLink
              to={item.link || "#"}
              onClick={isMobile ? onNavigate : undefined}
              className="flex items-center gap-3 min-h-10 px-3 py-2 text-sm text-base-content/80 hover:text-primary rounded-lg hover:bg-base-100 transition-colors duration-150 whitespace-nowrap overflow-hidden"
            >

              <span className="shrink-0">
                {item.icon}
              </span>

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
      ))}
    </>
  );
};

export default NavMenu;
