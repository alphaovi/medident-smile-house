import  { useMemo } from "react";

const PaymentTable = ({ data, isSingleDoctorSelected, startDate, endDate }) => {
  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "N/A";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // ১. All Doctors View - ডাক্তারভিত্তিক Consolidated Summary
  const consolidatedSummary = useMemo(() => {
    const doctorMap = {};

    data.forEach((item) => {
      const docId = item.doctorId || "N/A";
      if (!doctorMap[docId]) {
        doctorMap[docId] = {
          doctorId: docId,
          doctorName: item.doctorName || "Unknown Doctor",
          clinicName: item.clinicName || "",
          totalAmount: 0,
        };
      }
      doctorMap[docId].totalAmount += Number(item.paidAmount || item.price || item.amount || 0);
    });

    return Object.values(doctorMap);
  }, [data]);

  // ২. Grand Total
  const grandTotal = useMemo(() => {
    return data.reduce(
      (acc, curr) => acc + Number(curr.paidAmount || curr.price || curr.amount || 0),
      0
    );
  }, [data]);

  const formattedFromDate = formatDateToDDMMYYYY(startDate) || "01/01/2026";
  const formattedToDate = formatDateToDDMMYYYY(endDate) || "30/09/2026";
  const dateRangeStr = `${formattedFromDate} to ${formattedToDate}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">DATE</th>
              {isSingleDoctorSelected ? (
                <>
                  <th className="py-3.5 px-6">VOUCHER ID</th>
                  <th className="py-3.5 px-6">DOCTOR / CLINIC</th>
                  <th className="py-3.5 px-6">CASE / PAYMENT REF</th>
                </>
              ) : (
                <>
                  <th className="py-3.5 px-6">DOCTOR ID</th>
                  <th className="py-3.5 px-6">DOCTOR NAME</th>
                  <th className="py-3.5 px-6">CASE / PAYMENT REF</th>
                </>
              )}
              <th className="py-3.5 px-6 text-right">AMOUNT (BDT)</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs">
            {/* ----------------- ALL DOCTORS VIEW (CONSOLIDATED) ----------------- */}
            {!isSingleDoctorSelected && consolidatedSummary.length > 0 && (
              consolidatedSummary.map((row) => (
                <tr key={row.doctorId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                    {dateRangeStr}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-blue-700 text-xs">
                      {row.doctorId}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800 text-sm">{row.doctorName}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{row.clinicName}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-600 text-xs">Multiple Cases</div>
                    <div className="text-[11px] text-slate-400">Total Consolidated Sum</div>
                  </td>
                  <td className="py-4 px-6 text-right font-extrabold text-emerald-600 text-sm">
                    ৳ {row.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))
            )}

            {/* ----------------- SINGLE DOCTOR VIEW (INDIVIDUAL) ----------------- */}
            {isSingleDoctorSelected && data.length > 0 && (
              data.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                    {formatDateToDDMMYYYY(row.paymentDate || row.deliveryDate || row.date)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-blue-700 text-xs">
                      {row.voucherId || `VOUCH-${800 + (row.id || index)}`}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800 text-sm">{row.doctorName}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{row.clinicName}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-700 text-xs">
                      {row.caseNo || `CS-${9900 + (row.id || index)}`}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {row.paymentMethod || "Bkash"} 
                      {row.transactionNo ? ` (${row.transactionNo})` : " (TRX-5566)"} 
                      {row.status ? ` (${row.status})` : ""}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right font-extrabold text-emerald-600 text-sm">
                    ৳ {(row.paidAmount || row.price || row.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))
            )}

            {/* EMPTY STATE */}
            {data.length === 0 && (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                  No payment records found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>

          {/* GRAND TOTAL */}
          {data.length > 0 && (
            <tfoot>
              <tr className="bg-slate-900 text-white font-bold">
                <td colSpan="4" className="py-3.5 px-6 text-right uppercase tracking-wider text-[11px]">
                  Grand Total Amount:
                </td>
                <td className="py-3.5 px-6 text-right text-emerald-400 text-sm font-black">
                  ৳ {grandTotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;