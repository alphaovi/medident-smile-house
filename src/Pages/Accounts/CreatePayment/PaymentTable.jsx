import React from "react";

const PaymentTable = ({
  cases,
  selectedCases,
  onSelectAll,
  onSelectCase,
}) => {
  const isAllSelected = cases.length > 0 && selectedCases.length === cases.length;

  return (
    <div className="flex-1 w-full overflow-hidden rounded-lg border border-gray-300 shadow-sm bg-white">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[680px] md:min-w-full border-collapse text-sm text-center">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-300">
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">Order No</th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">Order Date</th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">Grand Total</th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">Paid Amount</th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">Due Amount</th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">Status</th>
              <th className="p-2 whitespace-nowrap">
                <div className="flex items-center justify-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    className="cursor-pointer size-4 accent-emerald-600"
                  />
                  <span>Select All</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cases.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-gray-400 font-medium">
                  No sale orders found. Select a doctor/customer to view orders.
                </td>
              </tr>
            ) : (
              cases.map((item) => {
                const isSelected = selectedCases.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-gray-50 ${
                      isSelected ? "bg-emerald-50/50" : "bg-white"
                    }`}
                  >
                    <td className="border-r border-gray-200 p-2 font-mono font-medium text-gray-800">
                      {item.orderNo}
                    </td>
                    <td className="border-r border-gray-200 p-2 text-gray-600">
                      {item.orderDate}
                    </td>
                    <td className="border-r border-gray-200 p-2 font-semibold text-gray-800">
                      ৳{item.grandTotal}
                    </td>
                    <td className="border-r border-gray-200 p-2 font-semibold text-emerald-700">
                      ৳{item.paidAmount}
                    </td>
                    <td className="border-r border-gray-200 p-2 font-bold text-rose-600">
                      ৳{item.dueAmount}
                    </td>
                    <td className="border-r border-gray-200 p-2 font-medium text-amber-600">
                      <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs capitalize">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <div
                        onClick={() => onSelectCase(item.id)}
                        className="inline-flex items-center justify-center gap-2 px-2.5 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer select-none"
                      >
                        <span className="text-xs font-semibold text-gray-700">
                          ৳{item.dueAmount}
                        </span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="cursor-pointer size-4 accent-emerald-600 pointer-events-none"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;