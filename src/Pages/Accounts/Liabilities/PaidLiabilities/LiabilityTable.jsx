import { useState } from "react";

const LiabilityTable = ({
  liabilities,
  selectedLiabilities,
  payingAmounts,
  onSelectAll,
  onSelectLiability,
  onAmountChange,
}) => {
  const [activeInfo, setActiveInfo] = useState(null);

  const isAllSelected =
    liabilities.length > 0 && selectedLiabilities.length === liabilities.length;

  return (
    <div className="flex-1 w-full overflow-hidden rounded-lg border border-gray-300 shadow-sm bg-white">
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[650px] md:min-w-full border-collapse text-sm text-center">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-300">
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">
                Liability ID
              </th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">
                Received Date
              </th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">
                Group
              </th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">
                Sub Group
              </th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">
                Voucher
              </th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">
                Amount
              </th>
              <th className="border-r border-gray-300 p-2 whitespace-nowrap">
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
              <th className="p-2 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {liabilities.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-gray-400 font-medium">
                  No liabilities found. Select Group or Sub Group to filter.
                </td>
              </tr>
            ) : (
              liabilities.map((item) => {
                const isSelected = selectedLiabilities.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-gray-50 ${
                      isSelected ? "bg-emerald-50/50" : "bg-white"
                    }`}
                  >
                    <td className="border-r border-gray-200 p-2 font-mono font-medium text-gray-800">
                      {item.id}
                    </td>
                    <td className="border-r border-gray-200 p-2 text-gray-600">
                      {item.receivedDate}
                    </td>
                    <td className="border-r border-gray-200 p-2 font-medium text-gray-800">
                      {item.head}
                    </td>
                    <td className="border-r border-gray-200 p-2 text-gray-600">
                      {item.subHead}
                    </td>
                    <td className="border-r border-gray-200 p-2 text-gray-600 font-mono">
                      {item.voucherNo}
                    </td>
                    <td className="border-r border-gray-200 p-2 font-semibold text-gray-800">
                      ৳{item.amount}
                    </td>
                    <td className="border-r border-gray-200 p-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <input
                          type="number"
                          value={payingAmounts[item.id] ?? item.amount}
                          onChange={(e) =>
                            onAmountChange(item.id, e.target.value)
                          }
                          disabled={!isSelected}
                          className="w-20 border border-gray-300 rounded px-1.5 py-0.5 text-center font-medium focus:outline-none focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-400"
                        />
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectLiability(item.id)}
                          className="cursor-pointer size-4 accent-emerald-600"
                        />
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center items-center gap-2 text-base">
                        <button
                          onClick={() => setActiveInfo(item)}
                          className="hover:scale-110 transition-transform"
                          title="Info"
                        >
                          ℹ️
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="hover:scale-110 transition-transform"
                          title="Print"
                        >
                          🖨️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal / Pop-up */}
      {activeInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5 border border-gray-200">
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h3 className="text-lg font-bold text-sky-600">
                Liability Details ({activeInfo.id})
              </h3>
              <button
                onClick={() => setActiveInfo(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm text-left">
              <p>
                <strong>Group (Head):</strong> {activeInfo.head}
              </p>
              <p>
                <strong>Sub Group (Sub Head):</strong> {activeInfo.subHead}
              </p>
              <p>
                <strong>Source:</strong> {activeInfo.source}
              </p>
              <p>
                <strong>Voucher No:</strong> {activeInfo.voucherNo}
              </p>
              <p>
                <strong>Received Date:</strong> {activeInfo.receivedDate}
              </p>
              <p>
                <strong>Total Amount:</strong> ৳{activeInfo.amount}
              </p>
              <p>
                <strong>Notes / Description:</strong> {activeInfo.notes}
              </p>
            </div>
            <div className="mt-5 text-right">
              <button
                onClick={() => setActiveInfo(null)}
                className="bg-sky-500 text-white font-semibold px-4 py-1.5 rounded hover:bg-sky-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiabilityTable;