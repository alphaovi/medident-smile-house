import AccountOwnerDropdown from "./AccountOwnerDropdown";

const PaymentSummary = ({
  totalAmount,
  onTotalAmountChange,
  maxPayableAmount,
  usersList = [],
  selectedOwnerId,
  onSelectOwner,
  userAccounts = [],
  selectedBankId,
  setSelectedBankId,
  note,
  setNote,
  receiptFile,
  onFileChange,
  onSubmit,
  submitting,
}) => {
  const selectedAccount = userAccounts.find(
    (acc) => String(acc._id) === String(selectedBankId)
  );

  return (
    <div className="w-full md:w-80 bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        <div className="text-center">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            Total Paying
          </label>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              min="0"
              max={maxPayableAmount || undefined}
              value={totalAmount}
              onChange={(e) => onTotalAmountChange(e.target.value)}
              className="w-32 text-center text-2xl font-extrabold text-gray-800 border border-gray-300 rounded-md py-1.5 px-2 focus:outline-none focus:border-sky-500"
            />
            <span className="text-sm font-bold text-gray-700">TK</span>
          </div>
          {maxPayableAmount > 0 && (
            <p className="text-[11px] text-gray-400 mt-1">
              Max Payable: ৳{maxPayableAmount.toLocaleString()}
            </p>
          )}
        </div>

        <AccountOwnerDropdown
          usersList={usersList}
          selectedOwnerId={selectedOwnerId}
          onSelectOwner={onSelectOwner}
        />

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Select Deposit Account
          </label>
          <select
            value={selectedBankId}
            onChange={(e) => setSelectedBankId(e.target.value)}
            disabled={!selectedOwnerId || userAccounts.length === 0}
            className="w-full p-2.5 text-sm font-semibold text-gray-800 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-sky-500 disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
          >
            {userAccounts.length === 0 ? (
              <option value="">No active account found for this user</option>
            ) : (
              <>
                <option value="">-- Select Account --</option>
                {userAccounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.bankName}
                    {acc.accountNo ? ` (${acc.accountNo})` : ""} — {acc.accountName}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* Full Account Details Box (Note-এর ঠিক উপরে) */}
        {selectedAccount && (
          <div className="p-3 rounded-md bg-sky-50/70 border border-sky-200 text-xs space-y-1 text-gray-700">
            <div className="font-bold text-sky-800 uppercase text-[11px] tracking-wide border-b border-sky-200 pb-1 mb-1">
              Account Details
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-500">Account Name:</span>
              <span className="font-semibold text-gray-800 text-right">
                {selectedAccount.bankName}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-500">Account Holder:</span>
              <span className="font-semibold text-gray-800 text-right">
                {selectedAccount.accountName}
              </span>
            </div>
            {selectedAccount.accountNo && (
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Account No:</span>
                <span className="font-mono font-semibold text-gray-800 text-right">
                  {selectedAccount.accountNo}
                </span>
              </div>
            )}
            {selectedAccount.branch && (
              <div className="flex justify-between gap-2">
                <span className="text-gray-500">Branch:</span>
                <span className="font-medium text-gray-800 text-right">
                  {selectedAccount.branch}
                </span>
              </div>
            )}
            {selectedAccount.details && (
              <div className="pt-1 border-t border-sky-100 text-[11px] text-gray-600">
                <span className="font-semibold text-gray-500">Details: </span>
                {selectedAccount.details}
              </div>
            )}
          </div>
        )}

        {/* Note (Full Account Details-এর নিচে) */}
        <div>
          <textarea
            rows="2"
            placeholder="Note (Optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 resize-none"
          />
        </div>

        <div>
          <label className="w-full flex items-center justify-center px-3 py-2 border border-dashed border-gray-400 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition">
            <span className="truncate">
              {receiptFile ? receiptFile.name : "Upload Receipt (Optional)"}
            </span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-bold text-sm rounded-md shadow-sm transition cursor-pointer"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default PaymentSummary;