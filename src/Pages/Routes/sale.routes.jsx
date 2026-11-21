import Sales from "../Sales/Sales/Sales";
import CreateSell from "../Sales/CreateSale/CreateSale";
import SaleRequest from "../Sales/SaleRequest/SaleRequest/SaleRequest";
import SellLists from "../Sales/SellList/SellLists";
import SellReturn from "../Sales/SaleReturn/SellReturn";


const saleRoutes = [

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
]

export default saleRoutes;