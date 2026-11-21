const PaymentSummary = ({
  totalAmount,
  onTotalAmountChange,
  maxPayableAmount,
  paymentType,
  setPaymentType,
  banksList = [],
  selectedBankId,
  setSelectedBankId,
  note,
  setNote,
  receiptFile,
  onFileChange,
  onSubmit,
  submitting = false,
}) => {
  const selectedBank = banksList.find((b) => String(b._id) === String(selectedBankId));

  return (
    <div className="w-full md:w-72 border border-gray-300 p-4 flex flex-col items-center gap-3.5 bg-gray-50 rounded h-fit">
      <div className="text-center w-full">
        <span className="text-sm font-semibold text-gray-500 block">Total Paying</span>
        <div className="flex items-center justify-center gap-1 mt-1">
          <input
            type="number"
            min="0"
            max={maxPayableAmount > 0 ? maxPayableAmount : undefined}
            value={totalAmount}
            onChange={(e) => onTotalAmountChange(e.target.value)}
            className="w-28 text-center text-2xl font-bold text-gray-800 bg-white border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-emerald-500"
          />
          <span className="text-lg font-bold text-gray-800">TK</span>
        </div>
      </div>

      {/* Payment Method Type: Cash or Bank */}
      <select
        value={paymentType}
        onChange={(e) => {
          setPaymentType(e.target.value);
          if (e.target.value === "Cash") {
            setSelectedBankId("");
          }
        }}
        className="w-full p-2 border border-gray-300 rounded bg-white text-sm font-medium focus:outline-none focus:border-emerald-500"
      >
        <option value="Cash">Cash</option>
        <option value="Bank">Bank</option>
      </select>

      {/* Bank Dropdown when Bank is selected */}
      {paymentType === "Bank" && (
        <div className="w-full space-y-2">
          <select
            value={selectedBankId}
            onChange={(e) => setSelectedBankId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-white text-xs font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="">-- Select Bank Account --</option>
            {banksList.map((bank) => (
              <option key={bank._id} value={bank._id}>
                {bank.bankName} ({bank.accountNo})
              </option>
            ))}
          </select>

          {/* Selected Bank Details Preview */}
          {selectedBank && (
            <div className="w-full p-2.5 bg-sky-50 border border-sky-200 rounded text-[11px] text-gray-700 space-y-0.5">
              <p className="font-bold text-sky-800">{selectedBank.bankName}</p>
              <p>
                <span className="font-semibold">A/C Name:</span> {selectedBank.accountName}
              </p>
              <p>
                <span className="font-semibold">A/C No:</span> {selectedBank.accountNo}
              </p>
              {selectedBank.branch && (
                <p>
                  <span className="font-semibold">Branch:</span> {selectedBank.branch}
                </p>
              )}
              {selectedBank.details && (
                <p className="text-gray-500 italic">{selectedBank.details}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Optional Note */}
      <textarea
        rows={2}
        placeholder="Note (Optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-sky-500 bg-white"
      />

      {/* Optional Upload Receipt */}
      <label className="w-full text-center border border-dashed border-gray-400 p-2 rounded cursor-pointer text-xs bg-white hover:bg-gray-100 transition-colors truncate">
        {receiptFile ? receiptFile.name : "Upload Receipt (Optional)"}
        <input type="file" onChange={onFileChange} className="hidden" />
      </label>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-bold py-2 rounded transition-colors cursor-pointer"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default PaymentSummary;