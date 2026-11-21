import { useState, useMemo } from "react";

const PaymentTable = ({ paymentData, filters }) => {
  // State variables for search input and pagination logic (default 20 entries)
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // Flatten sales orders -> payments from database and sort date-wise
  const rawPayments = useMemo(() => {
    const orders = Array.isArray(paymentData)
      ? paymentData
      : paymentData?.data || paymentData?.doctors || [];

    if (!Array.isArray(orders)) return [];

    const flattened = orders.flatMap((order) => {
      const orderPayments = Array.isArray(order?.payments) ? order.payments : [];
      const cust = typeof order?.customer === "object" ? order.customer : null;
      const customerId = String(cust?._id || cust?.id || order?.customer || "");
      const customerName =
        cust?.doctorName ||
        cust?.customerName ||
        cust?.name ||
        cust?.companyName ||
        "N/A";
      const orderRef =
        order?.orderNumber ||
        order?.id ||
        (order?._id ? String(order._id).slice(-6).toUpperCase() : "N/A");
      const stateVal =
        order?.stateOrRegion ||
        cust?.division ||
        cust?.state ||
        "N/A";
      const address =
        cust?.address ||
        cust?.fullAddress ||
        cust?.clinicAddress ||
        stateVal ||
        "N/A";

      return orderPayments.map((payment, idx) => {
        const rawDate = payment?.date || order?.orderDate || order?.createdAt || "";
        const parsedDate = rawDate ? new Date(rawDate) : null;
        const formattedDate =
          parsedDate && !Number.isNaN(parsedDate.getTime())
            ? parsedDate.toISOString().split("T")[0]
            : "";

        return {
          id: payment?._id || `${order?._id || "pay"}-${idx}`,
          customerId,
          paymentDate: formattedDate,
          rawTimestamp:
            parsedDate && !Number.isNaN(parsedDate.getTime())
              ? parsedDate.getTime()
              : 0,
          clientName: customerName,
          paymentBy: customerName,
          state: stateVal,
          officeName: stateVal,
          officeAddress: address,
          reference: payment?.reference || orderRef,
          paymentType: payment?.paymentMethod || payment?.method || "Cash",
          paymentAmount: Number(payment?.amount) || 0,
          status: payment?.status || "Approved",
          note: payment?.note || "",
        };
      });
    });

    // Date-wise chronological sort
    return flattened.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
  }, [paymentData]);

  // Combine table search box filtering and search form filters
  const filteredPayments = useMemo(() => {
    return rawPayments.filter((payment) => {
      // Table search input filter
      const matchesSearch = Object.values(payment).some((val) =>
        String(val || "").toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (!matchesSearch) return false;

      // Top filter form criteria checks
      if (filters) {
        if (
          filters.state &&
          String(payment.state || "").toLowerCase() !== filters.state.toLowerCase()
        ) {
          return false;
        }
        if (filters.customerId) {
          if (String(payment.customerId) !== String(filters.customerId)) return false;
        } else if (filters.clientName) {
          if (
            !String(payment.clientName || "")
              .toLowerCase()
              .includes(filters.clientName.toLowerCase())
          ) {
            return false;
          }
        }
        if (
          filters.officeAddress &&
          !String(payment.officeAddress || "")
            .toLowerCase()
            .includes(filters.officeAddress.toLowerCase())
        ) {
          return false;
        }
        if (filters.fromDate) {
          const fromTime = new Date(`${filters.fromDate}T00:00:00`).getTime();
          if (payment.rawTimestamp < fromTime) return false;
        }
        if (filters.toDate) {
          const toTime = new Date(`${filters.toDate}T23:59:59.999`).getTime();
          if (payment.rawTimestamp > toTime) return false;
        }
      }

      return true;
    });
  }, [rawPayments, searchTerm, filters]);

  // Filtered total amount for professional report feel
  const filteredTotalAmount = useMemo(() => {
    return filteredPayments.reduce(
      (sum, item) => sum + (Number(item.paymentAmount) || 0),
      0
    );
  }, [filteredPayments]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPayments.length / entriesPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * entriesPerPage;
  const paginatedData = filteredPayments.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 md:p-6 mb-8">
      {/* Top Toolbar: Entries Per Page (Default 20) & Quick Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-semibold text-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="font-medium">entries</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="font-medium shrink-0">Search:</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search payments..."
            className="w-full sm:w-60 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 transition"
          />
        </div>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto w-full rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3.5 border-r border-slate-200">Payment Id</th>
              <th className="py-3 px-3.5 border-r border-slate-200">Payment Date</th>
              <th className="py-3 px-3.5 border-r border-slate-200">Client Name</th>
              <th className="py-3 px-3.5 border-r border-slate-200">Payment By</th>
              <th className="py-3 px-3.5 border-r border-slate-200">Reference</th>
              <th className="py-3 px-3.5 border-r border-slate-200">Payment Type</th>
              <th className="py-3 px-3.5 text-right">Payment Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-sky-50/50 transition-colors text-slate-700"
                >
                  <td className="py-3 px-3.5 border-r border-slate-100 font-mono font-semibold text-sky-700">
                    {String(row.id).slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-3.5 border-r border-slate-100 font-medium text-slate-800 whitespace-nowrap">
                    {row.paymentDate || "—"}
                  </td>
                  <td className="py-3 px-3.5 border-r border-slate-100 font-semibold text-slate-800">
                    {row.clientName}
                  </td>
                  <td className="py-3 px-3.5 border-r border-slate-100 text-slate-600">
                    {row.paymentBy}
                  </td>
                  <td className="py-3 px-3.5 border-r border-slate-100">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {row.reference}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 border-r border-slate-100">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                      {row.paymentType}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right font-bold text-emerald-700 whitespace-nowrap">
                    ৳{Number(row.paymentAmount).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-10 px-4 text-center text-slate-400 font-medium">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
          {paginatedData.length > 0 && (
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold text-slate-800">
                <td colSpan="6" className="py-3 px-3.5 text-right uppercase text-[11px] tracking-wider text-slate-600">
                  Filtered Total Amount:
                </td>
                <td className="py-3 px-3.5 text-right text-emerald-700 text-sm whitespace-nowrap">
                  ৳{Number(filteredTotalAmount).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Footer Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-xs text-slate-500 gap-3">
        <div>
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredPayments.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-700">
            {Math.min(startIndex + entriesPerPage, filteredPayments.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {filteredPayments.length}
          </span>{" "}
          entries
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 border border-slate-300 rounded-lg font-medium disabled:opacity-45 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              type="button"
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1.5 border rounded-lg font-semibold transition cursor-pointer ${
                safeCurrentPage === idx + 1
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            type="button"
            disabled={safeCurrentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 border border-slate-300 rounded-lg font-medium disabled:opacity-45 hover:bg-slate-100 transition cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;