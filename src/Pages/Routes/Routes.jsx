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
        path: "/settings",
        element: <Settings></Settings>,
      },
      {
        path: "/settings/manage-suppliers",
        element: <ManageSuppliers></ManageSuppliers>,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);

export default router;
