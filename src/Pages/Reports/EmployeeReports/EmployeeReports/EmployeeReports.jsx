import { Link } from "react-router";
import { 
  Briefcase, 
  FolderCheck, 
  Receipt,
  ArrowRight, 
  Users
} from "lucide-react";

const EmployeeReports = () => {
  // Employee summary cards configuration
  const reportCards = [
    {
      id: "sr-work-summary",
      title: "SR Work Summary",
      description: "Track individual employee tasks, total completed works, and overall productivity logs.",
      path: "/reports/employee-work-summary",
      icon: Briefcase,
      badge: "Work Log",
      gradient: "from-indigo-600 to-blue-700",
      lightBg: "bg-indigo-50 text-indigo-600",
      hoverBorder: "hover:border-indigo-300",
    },
    {
      id: "SR-case-summary",
      title: "SR Case Summary",
      description: "Analyze cases assigned to employees, active resolutions, and medical case histories.",
      path: "/reports/employee-case-summary",
      icon: FolderCheck,
      badge: "Case Log",
      gradient: "from-teal-600 to-emerald-700",
      lightBg: "bg-teal-50 text-teal-600",
      hoverBorder: "hover:border-teal-300",
    },
    {
      id: "sr-ledger",
      title: "SR Ledger",
      description: "Review staff payroll, advances, incentive payouts, and detailed account statements.",
      path: "/reports/employee-ledger",
      icon: Receipt,
      badge: "Accounts",
      gradient: "from-slate-700 to-slate-900",
      lightBg: "bg-slate-100 text-slate-700",
      hoverBorder: "hover:border-slate-400",
    },
    {
      id: "technician-ledger",
      title: "Technician Ledger",
      description: "Track individual employee tasks, total completed works, and overall productivity logs.",
      path: "/reports/employee-reports/technician-ledger",
      icon: Briefcase,
      badge: "Technician Ledger",
      gradient: "from-indigo-600 to-blue-700",
      lightBg: "bg-indigo-50 text-indigo-600",
      hoverBorder: "hover:border-indigo-300",
    },
    
  ];

  return (
    <div className="p-6 bg-slate-100/60 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section with Dark Indigo/Slate styling to contrast with Client Reports */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/50">
                Internal Analytics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-3 text-white">
              Employee Reports Dashboard
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Select an employee report card below to review workforce performance and accounts.
            </p>
          </div>
        </div>

        {/* Employee Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.path}
                className={`group relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${card.hoverBorder} hover:-translate-y-1`}
              >
                {/* Accent Top Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`}
                />

                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3.5 rounded-xl ${card.lightBg} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">
                  <span>View Analytics</span>
                  <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
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

export default EmployeeReports;