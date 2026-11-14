import React from 'react';

const GlobalStatementPrint = ({
  companyName = "MEDIDENT",
  companyAddress = "Mirpur, Dhaka, Bangladesh",
  companyPhone = "+880 1XXX-XXXXXX",
  reportTitle = "ACCOUNT STATEMENT",
  clientInfo = {
    name: "",
    address: "",
    phone: "",
    accountId: "",
  },
  metaInfo = {
    periodFrom: "",
    periodTo: "",
    currency: "Bangladeshi Taka (BDT)",
    statusFilter: "ALL",
  },
  columns = [],
  rows = [],
  summaryRows = [],
  openingBalanceRow = null,
}) => {
  return (
    <div className="hidden print:block print:w-full print:bg-white print:text-black font-sans text-xs">
      {/* Top Header: Company Info */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-4">
        <div className="space-y-1 max-w-[50%]">
          <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
            {clientInfo.address || "Mirpur, Dhaka"}
          </h2>
          {clientInfo.phone && (
            <p className="text-[11px] text-slate-700">Phone: {clientInfo.phone}</p>
          )}
        </div>

        <div className="text-right space-y-1 max-w-[45%]">
          <h1 className="text-lg font-black uppercase tracking-wider text-slate-900">
            {companyName}
          </h1>
          <p className="text-[11px] text-slate-700">{companyAddress}</p>
          <p className="text-[11px] text-slate-700">{companyPhone}</p>
        </div>
      </div>

      {/* Meta Info: Customer ID -> Customer Name -> Statement Period */}
      <div className="grid grid-cols-2 gap-8 mb-5 text-[11px] border-b border-slate-300 pb-4">
        <div className="space-y-1.5">
          {clientInfo.accountId && (
            <div className="flex">
              <span className="w-32 font-bold text-slate-700">Customer ID</span>
              <span>: {clientInfo.accountId}</span>
            </div>
          )}
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Customer Name</span>
            <span className="font-extrabold uppercase">: {clientInfo.name || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Statement Period</span>
            <span>
              : {metaInfo.periodFrom} to {metaInfo.periodTo}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Currency Name</span>
            <span>: {metaInfo.currency}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Filter Status</span>
            <span className="uppercase">: {metaInfo.statusFilter}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Print Date</span>
            <span>: {new Date().toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-800 inline-block pb-0.5">
          {reportTitle}
        </h3>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-slate-400 text-[11px] mb-6">
        <thead>
          <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`p-2 border-r border-slate-400 last:border-r-0 ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {openingBalanceRow && (
            <tr className="font-bold bg-slate-50 border-b border-slate-300">
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className={`p-2 border-r border-slate-300 last:border-r-0 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {openingBalanceRow[col.key] || ''}
                </td>
              ))}
            </tr>
          )}

          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="border-b border-slate-300">
              {columns.map((col, cIdx) => (
                <td
                  key={cIdx}
                  className={`p-2 border-r border-slate-300 last:border-r-0 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary Box Moved to Right Side */}
      {summaryRows.length > 0 && (
        <div className="flex justify-end mb-6">
          <div className="w-72 border border-slate-400 text-[11px]">
            {summaryRows.map((sRow, idx) => (
              <div
                key={idx}
                className={`flex justify-between p-1.5 border-b border-slate-300 last:border-b-0 ${
                  sRow.isBold ? 'font-extrabold bg-slate-100' : 'font-medium'
                }`}
              >
                <span>{sRow.label}</span>
                <span>{sRow.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-8 space-y-2">
        <p className="font-bold tracking-widest text-[11px] text-slate-800">
          -- END OF STATEMENT --
        </p>
        <p className="text-[10px] text-slate-600">
          Please note that find any issue must be notified within 15 days from the date of this statement.
        </p>
        <p className="text-[10px] font-semibold text-slate-800 pt-2 border-t border-slate-300">
          This is a computer generated statement and does not require any signature[cite: 10].
        </p>
      </div>
    </div>
  );
};

export default GlobalStatementPrint;