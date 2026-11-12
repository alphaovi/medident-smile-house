import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const FinancialReports = () => {
  const navigate = useNavigate();

  const financialCards = [
    {
      id: 'income',
      title: 'Income Report',
      description: 'Track revenue, sales breakdown, and incoming payments.',
      route: '/reports/financial/income-report',
      badge: 'Revenue',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'expense',
      title: 'Expense Report',
      description: 'Monitor operational costs, vendor payouts, and overheads.',
      route: '/reports/financial/expense-report',
      badge: 'Costs',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'asset',
      title: 'Asset Report',
      description: 'Overview of equipment, receivables, and capital assets.',
      route: '/reports/financial/asset-report',
      badge: 'Holdings',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'liability',
      title: 'Liability Report',
      description: 'Manage outstanding debts, pay ables, and obligations.',
      route: '/report/financial/liability-report',
      badge: 'Pay ables',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white text-gray-900 rounded-2xl shadow-sm border border-gray-100 font-sans">
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select a category below to view detailed financial statements and data logs.
        </p>
      </div>

      {/* 4 Clean Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
            onClick={() => navigate(card.route)}
            className="group relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Card Header with Icon and Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.iconBg} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  {card.icon}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {card.description}
              </p>
            </div>

            {/* Action Link Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-gray-600 group-hover:text-blue-600">
              <span>View Detailed Report</span>
              <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FinancialReports;