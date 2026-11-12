

const SummaryTable = ({ reportData }) => {
  const totalPrice = reportData.reduce((acc, curr) => acc + curr.price, 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Received":
        return "bg-sky-50 text-sky-700 border-sky-200/60";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200/60";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Product ID</th>
              <th className="py-3.5 px-4">Product Name</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Quantity</th>
              <th className="py-3.5 px-4 text-right">Price (BDT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {reportData.length > 0 ? (
              reportData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-blue-50/30 transition-colors duration-150"
                >
                  <td className="py-3.5 px-4 font-semibold text-gray-900">
                    <span className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {row.productId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-800 font-medium">
                    {row.productName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                        row.status
                      )}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-gray-600 font-medium">
                    {row.quantity}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-gray-900">
                    ৳ {row.price.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-12 text-center text-gray-400 font-medium"
                >
                  No records match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
          {reportData.length > 0 && (
            <tfoot>
              <tr className="bg-gray-50/90 border-t-2 border-gray-200 font-bold text-gray-800">
                <td colSpan="4" className="py-4 px-4 text-right uppercase tracking-wider text-xs">
                  Grand Total Amount:
                </td>
                <td className="py-4 px-4 text-right text-blue-600 text-base font-extrabold">
                  ৳ {totalPrice.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;