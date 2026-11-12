import { createBrowserRouter } from "react-router";
import Main from "../../Layout/Main";
import NotFound from "../SharedPages/ErrorPage/NotFound";
import Dashboard from "../Dashboard/Dashboard";
import AddProduct from "../ManageProducts/AddProduct/AddProduct";
import ViewProducts from "../ManageProducts/ViewProducts/ViewProducts";
import LostItems from "../ManageProducts/LostItems/LostItems";
import Store from "../ManageProducts/Store/Store";
import PurchaseOrder from "../Purchase/PurchaseOrder/PurchaseOrder";
import Settings from "../Settings/Settings/Settings";
import ManageSuppliers from "../Settings/ManageSuppliers/ManageSuppliers";
import ManageCustomers from "../ManageCustomers/ManageCustomers";
import Sales from "../Sales/Sales/Sales";
import CreateSell from "../Sales/CreateSale/CreateSale";
import SaleRequest from "../Sales/SaleRequest/SaleRequest/SaleRequest";
import SellLists from "../Sales/SellList/SellLists";
import State from "../Settings/State/State";
import EmployeeManagement from "../Settings/EmployeeManagement/EmployeeManagement"
import SellReturn from "../Sales/SaleReturn/SellReturn";
import ClientReports from "../Reports/ClientReports/ClientReports/ClientReports";
import ClientStatement from "../Reports/ClientReports/ClientStatement/ClientStatement";
import WorkSummary from "../Reports/ClientReports/WorkSummary/WorkSummary";




const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "manage-product/add-product",
        element: <AddProduct />,
      },
      {
        path: "/manage-product/view-product",
        element: <ViewProducts></ViewProducts>,
      },
      {
        path: "/manage-product/store",
        element: <Store></Store>,
      },
      {
        path: "/manage-product/lost-items",
        element: <LostItems></LostItems>,
      },
      {
        path: "/purchase/purchase-order",
        element: <PurchaseOrder></PurchaseOrder>,
      },
      {
        path: "/manage-customers",
        element: <ManageCustomers></ManageCustomers>,
      },
      {
        path: "/sale",
        element: <Sales></Sales>,
      },
      {
        path: "/sale/create-sell",
        element: <CreateSell></CreateSell>,
      },
      {
        path: "/sell/sell-request",
        element: <SaleRequest></SaleRequest>,
      },
      {
        path: "/sell/sell-list",
        element: <SellLists></SellLists>,
      },
      {
        path: "/sell/sell-return",
        element: <SellReturn></SellReturn>,
      },
      {
        path: "/settings",
        element: <Settings></Settings>,
      },
      {
        path: "/settings/manage-suppliers",
        element: <ManageSuppliers></ManageSuppliers>,
      },
      {
        path: "/settings/employee-management",
        element: <EmployeeManagement></EmployeeManagement>,
      },
      {
        path: "/settings/state",
        element: <State></State>,
      },
      {
        path: "/reports/client-reports",
        element: <ClientReports></ClientReports>,
      },
      {
        path: "/reports/client-reports/client-statement",
        element: <ClientStatement></ClientStatement>,
      },
      {
        path: "/reports/client-reports/work-summary",
        element: <WorkSummary></WorkSummary>,
      },
      // {
      //   path: "/reports/client-reports/case-summary",
      //   element: <CaseSummary></CaseSummary>,
      // },
    ],
  },

  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);

export default router;
