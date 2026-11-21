const PaymentHeader = ({
  onCreatePayment,
  totalTransactions = 0,
  totalAmount = 0,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-sky-600 bg-sky-50 border border-sky-200/70 px-2.5 py-0.5 rounded-full mb-1.5">
            Accounts &amp; Ledger
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            View Payment
          </h1>
          <p className="text-xs md:text-sm font-medium text-slate-500 mt-0.5">
            Generate payment report for a certain duration &amp; filter by state, client, or date
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Entries
            </span>
            <span className="text-base font-extrabold text-slate-800">
              {totalTransactions}
            </span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/70">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              Total Received
            </span>
            <span className="text-base font-extrabold text-emerald-700">
              ৳{Number(totalAmount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">
          Payment Management
        </span>
        <button
          type="button"
          onClick={onCreatePayment}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
        >
          + Create Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentHeader;