import { Link } from "react-router";
import { 
  FileText, 
  Briefcase, 
  FolderCheck, 
  CreditCard, 
  Receipt,
  ArrowRight, 
  HandCoins
} from "lucide-react";

const ClientReports = () => {
  // 5 Cards configuration data
  const reportCards = [
    {
      id: "client-statement",
      title: "Client Statement",
      description: "View complete statement, billing details, and overall transaction ledger.",
      path: "/reports/client-reports/client-statement",
      icon: FileText,
      badge: "Statement",
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50 text-blue-600",
      hoverBorder: "hover:border-blue-300",
    },
    {
      id: "work-summary",
      title: "Work Summary",
      description: "Analyze completed orders, active tasks, and overall work progress.",
      path: "/reports/client-reports/work-summary",
      icon: Briefcase,
      badge: "Summary",
      gradient: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 text-emerald-600",
      hoverBorder: "hover:border-emerald-300",
    },
    {
      id: "case-summary",
      title: "Case Summary",
      description: "Review detailed case histories, ongoing status, and medical reports.",
      path: "/reports/client-reports/case-summary",
      icon: FolderCheck,
      badge: "Cases",
      gradient: "from-amber-500 to-orange-600",
      lightBg: "bg-amber-50 text-amber-600",
      hoverBorder: "hover:border-amber-300",
    },
    {
      id: "payment-summary",
      title: "Payment Summary",
      description: "Track received payments, pending invoices, and total revenues.",
      path: "/reports/client-reports/payment-summary-reports",
      icon: CreditCard,
      badge: "Finance",
      gradient: "from-purple-500 to-pink-600",
      lightBg: "bg-purple-50 text-purple-600",
      hoverBorder: "hover:border-purple-300",
    },
    {
      id: "client-ledger",
      title: "Client Ledger",
      description: "Monitor debit/credit balances, invoice logs, and client account history.",
      path: "/reports/client-reports/client-ledger",
      icon: Receipt,
      badge: "Ledger",
      gradient: "from-rose-500 to-red-600",
      lightBg: "bg-rose-50 text-rose-600",
      hoverBorder: "hover:border-rose-300",
    },
    {
      id: "Over-Due",
      title: "Over Due",
      description: "Monitor debit/credit balances, invoice logs, and client account history.",
      path: "/reports/client-reports/overdue-report",
      icon: HandCoins,
      badge: "Ledger",
      gradient: "from-rose-500 to-red-600",
      lightBg: "bg-rose-50 text-rose-600",
      hoverBorder: "hover:border-rose-300",
    },
  ];

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Overview Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-2">
              Client Reports
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select a category card below to view detailed analytical reports and data.
            </p>
          </div>
        </div>

        {/* 5 Modern Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {reportCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.path}
                className={`group relative bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${card.hoverBorder} hover:-translate-y-1.5`}
              >
                {/* Top Subtle Accent Bar on Hover */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="space-y-4">
                  {/* Top Row: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3.5 rounded-xl ${card.lightBg} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action / Link Indicator */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600 group-hover:text-blue-600 transition-colors">
                  <span>View Details</span>
                  <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ClientReports;