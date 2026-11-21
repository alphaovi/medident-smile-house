import AddProduct from "../ManageProducts/AddProduct/AddProduct";
import ViewProducts from "../ManageProducts/ViewProducts/ViewProducts";
import LostItems from "../ManageProducts/LostItems/LostItems";
import Store from "../ManageProducts/Store/Store";

const productRoutes = [
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
]

export default productRoutes;