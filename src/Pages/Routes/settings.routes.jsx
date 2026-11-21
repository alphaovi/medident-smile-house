import Settings from "../Settings/Settings/Settings";
import ManageSuppliers from "../Settings/ManageSuppliers/ManageSuppliers";


import State from "../Settings/State/State";
import EmployeeManagement from "../Settings/EmployeeManagement/EmployeeManagement"

import BankDetailsManagement from "../Settings/BankDetailsManagement/BankDetailsManagement";

const settingsRoutes = [
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
        path: "/settings/bank-details-management",
        element: <BankDetailsManagement></BankDetailsManagement>,
      },
]

export default settingsRoutes;