import ClientReports from "../Reports/ClientReports/ClientReports/ClientReports";
import ClientStatement from "../Reports/ClientReports/ClientStatement/ClientStatement";
import ClientLedger from "../Reports/ClientReports/ClientLedger/ClientLedger";



const clientsReportsRoutes = [
 {
        path: "/reports/client-reports",
        element: <ClientReports></ClientReports>,
      },
      {
        path: "/reports/client-reports/client-statement",
        element: <ClientStatement></ClientStatement>,
      },
      {
        path: "/reports/client-reports/client-ledger",
        element: <ClientLedger></ClientLedger>,
      },
];


export default clientsReportsRoutes;