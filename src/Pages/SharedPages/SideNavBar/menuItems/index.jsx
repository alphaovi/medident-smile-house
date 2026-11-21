import customerMenu from "./customer.menu";
import dashboardMenu from "./dashboard.menu";
import financeMenu from "./finance.menu";
import productMenu from "./product.menu";
import purchaseMenu from "./purchase.menu";
import reportsMenu from "./reports.menu";
import sellMenu from "./sell.menu";
import settingsMenu from "./settings.menu";

const navItems = [
...dashboardMenu,
...productMenu,
...customerMenu,
...purchaseMenu,
...sellMenu,
...financeMenu,
...reportsMenu,
...settingsMenu,


];

export default navItems;