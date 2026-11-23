import { createBrowserRouter } from "react-router";
import Main from "../../Layout/Main";

import dashboardRoutes from "./dashboard.routes";
import productRoutes from "./product.routes";
import purchaseRoutes from "./purchase.routes";
import customerRoutes from "./customer.routes";
import saleRoutes from "./sale.routes";
import settingsRoutes from "./settings.routes";
import clientsReportsRoutes from "./clientsReports.routes";
import notFoundRoutes from "./notFound.routes";
import financeRoutes from "./finance.routes";
import loginRoutes from "./login.routes";
import PrivateRoute from "./PrivateRoute/PrivateRoute";

const router = createBrowserRouter([
 ...loginRoutes,
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    children: [
      ...dashboardRoutes,
      ...productRoutes,
      ...customerRoutes,
      ...purchaseRoutes,
      ...saleRoutes,

      // Financial Reports
      ...financeRoutes,
      // Clients Report
      ...clientsReportsRoutes,

      
      ...settingsRoutes,

      // {
      //   path: "/reports/client-reports/case-summary",
      //   element: <CaseSummary></CaseSummary>,
      // },
    ],
  },

  ...notFoundRoutes,
]);

export default router;
