import { motion } from 'framer-motion';

const TechnicianLedgerTable = ({ itemList, totalQuantity }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Itemized Work Summary
        </h3>
        <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 font-medium">
          Showing items with Qty &ge; 1
        </span>
      </div>

      {itemList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/70 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                <th className="py-3.5 px-6">Product / Group Name</th>
                <th className="py-3.5 px-6 text-right">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {itemList.map((item, index) => (
                <motion.tr
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="py-4 px-6 font-medium capitalize text-gray-800">
                    {item.name}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-gray-900">
                    {item.quantity}
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 text-gray-900 font-bold border-t-2 border-gray-200 text-sm">
                <td className="py-4 px-6 uppercase tracking-wider">Total Quantity</td>
                <td className="py-4 px-6 text-right text-indigo-600 text-base">{totalQuantity}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-400 font-medium">
          No active items recorded with quantity greater than 0.
        </div>
      )}
    </div>
  );
};

export default TechnicianLedgerTable;