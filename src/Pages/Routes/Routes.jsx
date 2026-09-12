import { createBrowserRouter } from "react-router";
import Main from "../../Layout/Main";
import NotFound from "../SharedPages/ErrorPage/NotFound";
import Dashboard from "../Dashboard/Dashboard";
import AddProduct from "../ManageProducts/AddProduct/AddProduct";
import ViewProducts from "../ManageProducts/ViewProducts/ViewProducts";
import LostItems from "../ManageProducts/LostItems/LostItems";
import Store from "../ManageProducts/Store/Store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/manage-product/add-product",
        element: <AddProduct></AddProduct>,
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
    ],
  },

  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);

export default router;
