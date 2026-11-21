import { BarChart3, BotMessageSquare, IdCardLanyard, UsersRound } from "lucide-react";

const reportsMenu = [

 {
      name: "Reports",
      icon: <BarChart3 className="size-5 shrink-0" />,
      children: [
        {
          name: "Client Reports",
          icon: <UsersRound className="size-5 shrink-0" />,
          link: "/reports/client-reports",
        },
        {
          name: "Financial Reports",
          icon: <BotMessageSquare className="size-5 shrink-0" />,

          link: "/reports/client-reports",
        },
        {
          name: "Employee Reports",
          icon: <IdCardLanyard className="size-5 shrink-0" />,
          link: "/reports/client-reports",
        },
      ],
    },

];

export default reportsMenu;