import {  Briefcase, Building, CheckCircle2, ClipboardList,  Eye, FileSpreadsheet, MinusCircle, PieChart, PlusCircle, Scale, TrendingDown, UserCheck, Users, Wallet } from "lucide-react";

const financeMenu = [

{
      name: "Accounts",
      icon: <Users className="size-5 shrink-0" />,
      children: [
        {
          name: "Income",
          icon: <Wallet className="size-4 shrink-0" />,
          children: [
            
            {
              name: "Create Payment",
              icon: <PlusCircle className="size-4 shrink-0" />,
              link: "/finance/create-payment",
            },
            {
              name: "View Payment",
              icon: <Eye className="size-4 shrink-0" />,
              link: "/finance/view-payment",
            },
           
          ],
        },
        {
          name: "Expense",
          icon: <TrendingDown className="size-4 shrink-0" />,
          children: [
            {
              name: "Add Expense",
              icon: <MinusCircle className="size-4 shrink-0" />,
              link: "/finance/expense/add-expenses",
            },
            {
              name: "Expense List",
              icon: <ClipboardList className="size-4 shrink-0" />,
              link: "/finance/expense/expense-list",
            },
          ],
        },
        {
          name: "Asset",
          icon: <Briefcase className="size-4 shrink-0" />,
          children: [
            {
              name: "Asset Buy",
              icon: <PlusCircle className="size-4 shrink-0" />,
              link: "/finance/asset/asset-buy",
            },
            {
              name: "Asset Sell",
              icon: <MinusCircle className="size-4 shrink-0" />,
              link: "/finance/asset/asset-sell",
            },
            {
              name: "Asset List",
              icon: <Building className="size-4 shrink-0" />,
              link: "/finance/asset/asset-list",
            },
          ],
        },
        {
          name: "Liability",
          icon: <Scale className="size-4 shrink-0" />,
          children: [
            {
              name: "Add Liability",
              icon: <PlusCircle className="size-4 shrink-0" />,
              link: "/finance/liability/add-liability",
            },
            {
              name: "Paid Liabilities",
              icon: <CheckCircle2 className="size-4 shrink-0" />,
              link: "/finance/liability/paid-liabilities",
            },
            {
              name: "Liability List",
              icon: <ClipboardList className="size-4 shrink-0" />,
              link: "/finance/liability/liability-list",
            },
          ],
        },
        {
          name: "Equity",
          icon: <PieChart className="size-4 shrink-0" />,
          children: [
            {
              name: "Structure Of Shareholders",
              icon: <UserCheck className="size-4 shrink-0" />,
              link: "/finance/equity/shareholder-structure",
            },
            {
              name: "Equity Summary",
              icon: <FileSpreadsheet className="size-4 shrink-0" />,
              link: "/finance/equity/summary",
            },
          ],
        },
      ],
    },

];

export default financeMenu;