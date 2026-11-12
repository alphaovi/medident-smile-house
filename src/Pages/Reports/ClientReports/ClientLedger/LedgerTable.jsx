
/**
 * Table Component for Client Ledger Data
 * Handles conditional layout based on whether a specific clinic is selected or "ALL" is selected.
 */
const LedgerTable = ({ ledgerData = [], isSingleClinicSelected, selectedClinicDetails }) => {

  // Calculate totals for summary calculation with defensive fallback
  const totals = ledgerData.reduce(
    (acc, curr) => {
      const prevDue = Number(curr.previousDue ?? 0);
      const workAmt = Number(curr.workAmount ?? 0);
      const paidAmt = Number(curr.paidAmount ?? 0);
      const netDue = (prevDue + workAmt) - paidAmt;

      return {
        previousDue: acc.previousDue + prevDue,
        workAmount: acc.workAmount + workAmt,
        paidAmount: acc.paidAmount + paidAmt,
        totalBalance: acc.totalBalance + netDue,
      };
    },
    { previousDue: 0, workAmount: 0, paidAmount: 0, totalBalance: 0 }
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Banner Displayed when a Specific Clinic is Selected */}
      {isSingleClinicSelected && selectedClinicDetails && (
        <div className="bg-slate-800 text-white p-4 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-lg font-bold">{selectedClinicDetails.name}</h2>
              <p className="text-xs text-slate-300">Clinic ID: {selectedClinicDetails.id}</p>
            </div>
            <span className="mt-2 sm:mt-0 text-xs bg-slate-700 text-slate-200 px-3 py-1 rounded-full">
              Single Clinic Ledger View
            </span>
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
              <th className="p-3">Client ID</th>
              
              {/* Hide Clinic Columns if a specific Clinic Header is active */}
              {!isSingleClinicSelected && (
                <>
                  <th className="p-3">Clinic ID</th>
                  <th className="p-3">Clinic Name</th>
                </>
              )}

              <th className="p-3">Doctor Name</th>
              <th className="p-3 text-right">Previous Due (৳)</th>
              <th className="p-3 text-right">Work Amount (৳)</th>
              <th className="p-3 text-right">Payment Paid (৳)</th>
              <th className="p-3 text-right">Current Balance (৳)</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-200">
            {ledgerData.length > 0 ? (
              ledgerData.map((item) => {
                const prevDue = Number(item.previousDue ?? 0);
                const workAmt = Number(item.workAmount ?? 0);
                const paidAmt = Number(item.paidAmount ?? 0);
                const currentBalance = (prevDue + workAmt) - paidAmt;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium text-slate-700">{item.id}</td>
                    
                    {!isSingleClinicSelected && (
                      <>
                        <td className="p-3 text-slate-500">{item.clinicId}</td>
                        <td className="p-3 text-slate-700 font-medium">{item.clinicName}</td>
                      </>
                    )}

                    <td className="p-3 text-slate-700">{item.doctorName}</td>
                    <td className="p-3 text-right text-slate-600">{prevDue.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-slate-600">{workAmt.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-emerald-600 font-medium">{paidAmt.toLocaleString('en-IN')}</td>
                    <td className={`p-3 text-right font-bold ${currentBalance > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {currentBalance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td 
                  colSpan={isSingleClinicSelected ? 6 : 8} 
                  className="text-center p-8 text-slate-400"
                >
                  No ledger data found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>

          {/* Table Footer with Corrected Alignment & ColSpan */}
          {ledgerData.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                <td colSpan={isSingleClinicSelected ? 2 : 4} className="p-3 text-slate-700">
                  Total Summary
                </td>
                <td className="p-3 text-right text-slate-800">
                  {totals.previousDue.toLocaleString('en-IN')}
                </td>
                <td className="p-3 text-right text-slate-800">
                  {totals.workAmount.toLocaleString('en-IN')}
                </td>
                <td className="p-3 text-right text-emerald-700">
                  {totals.paidAmount.toLocaleString('en-IN')}
                </td>
                <td className="p-3 text-right text-amber-700">
                  {totals.totalBalance.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default LedgerTable;