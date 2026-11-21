
import CreatePayment from "../Accounts/CreatePayment/CreatePayment";
import ViewPayment from "../Accounts/ViewPayment/ViewPayment/ViewPayment";

const financeRoutes = [


{
    path: "/finance/create-payment",
    element: <CreatePayment></CreatePayment>
},

{
    path: "/finance/view-payment",
    element: <ViewPayment></ViewPayment>
}
    
];


export default financeRoutes;