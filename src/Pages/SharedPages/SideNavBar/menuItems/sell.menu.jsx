import { BadgeDollarSign, ClipboardCheck, FileText, Receipt, Undo2 } from "lucide-react";

const sellMenu = [
{
      name: "Sell",
      icon: <BadgeDollarSign className="size-5 shrink-0" />,

      children: [
        {
          name: "Create Sell",
          icon: <Receipt className="size-4 shrink-0" />,
          link: "/sale/create-sell",
        },
        {
          name: "Sell Request",
          icon: <ClipboardCheck className="size-4 shrink-0" />,
          link: "/sell/sell-request",
        },
        {
          name: "Sell List",
          icon: <FileText className="size-4 shrink-0" />,
          link: "/sell/sell-list",
        },
        {
          name: "Sell Return",
          icon: <Undo2 className="size-4 shrink-0" />,
          link: "/sell/sell-return",
        },
      ],
    },

]; 
export default sellMenu;