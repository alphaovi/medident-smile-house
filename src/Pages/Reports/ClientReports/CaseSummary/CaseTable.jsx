
import { motion, AnimatePresence } from 'framer-motion';

const  CaseTable =({
  isSingleDoctorMode,
  filteredData,
  groupedDataByDoctor,
  grandTotalAmount,
  fromDate,
  toDate,
}) => {
  // Helper function to format dates as DD/MM/YYYY
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const [yyyy, mm, dd] = dateStr.split('-');
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-medium">
              {isSingleDoctorMode ? (
                <>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Invoice / Voucher</th>
                  <th className="py-3.5 px-4">Delivery Date</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Amount (BDT)</th>
                </>
              ) : (
                <>
                  <th className="py-3.5 px-4">Date Range</th>
                  <th className="py-3.5 px-4">Doctor Name</th>
                  <th className="py-3.5 px-4">Clinic</th>
                  <th className="py-3.5 px-4 text-center">Total Cases</th>
                  <th className="py-3.5 px-4 text-right">Total Amount (BDT)</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {isSingleDoctorMode ? (
                // Itemized view for single doctor
                filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {formatDisplayDate(row.paymentDate)}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {row.patientName}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-slate-500">
                        {row.voucherId || row.caseNo}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {formatDisplayDate(row.deliveryDate)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {row.description || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900">
                        {(row.amount || row.paidAmount || 0).toLocaleString()} ৳
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 text-sm">
                      No cases found for the selected criteria.
                    </td>
                  </tr>
                )
              ) : (
                // Aggregated doctor view
                groupedDataByDoctor.length > 0 ? (
                  groupedDataByDoctor.map((docGroup) => (
                    <motion.tr
                      key={docGroup.doctorId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {formatDisplayDate(fromDate)} - {formatDisplayDate(toDate)}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {docGroup.doctorName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {docGroup.clinicName}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                          {docGroup.caseCount}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900">
                        {docGroup.totalAmount.toLocaleString()} ৳
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 text-sm">
                      No aggregated summary available.
                    </td>
                  </tr>
                )
              )}
            </AnimatePresence>
          </tbody>

          {/* Subtotal */}
          <tfoot>
            <tr className="bg-slate-100/90 font-semibold text-slate-800 border-t border-slate-200">
              <td
                colSpan={isSingleDoctorMode ? 5 : 4}
                className="py-3.5 px-4 text-right uppercase tracking-wider text-xs text-slate-500"
              >
                Sub Total :
              </td>
              <td className="py-3.5 px-4 text-right text-base text-slate-900 font-bold">
                {grandTotalAmount.toLocaleString()} ৳
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.div>
  );
}

export default CaseTable;