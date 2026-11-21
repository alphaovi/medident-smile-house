const LiabilitySummary = ({
  totalAmount,
  paymentMethod,
  setPaymentMethod,
  otherMfsName,
  setOtherMfsName,
  onFileChange,
  onSubmit,
}) => {
  return (
    <div className="w-full md:w-64 border border-gray-300 p-4 flex flex-col items-center gap-4 bg-gray-50 rounded h-fit">
      <div className="text-center">
        <span className="text-sm font-semibold text-gray-500 block">
          Total Paying
        </span>
        <span className="text-2xl font-bold text-gray-800">{totalAmount} TK</span>
      </div>

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded bg-white text-sm focus:outline-none"
      >
        <option value="Cash">Cash</option>
        <option value="bKash">bKash</option>
        <option value="Nagad">Nagad</option>
        <option value="Bank">Bank Transfer</option>
        <option value="Card">Card</option>
        <option value="Other MFS">Other MFS</option>
      </select>

      {paymentMethod === "Other MFS" && (
        <input
          type="text"
          placeholder="Enter MFS Name (e.g. Rocket, Upay)"
          value={otherMfsName}
          onChange={(e) => setOtherMfsName(e.target.value)}
          className="w-full p-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-sky-500 bg-white"
        />
      )}

      <label className="w-full text-center border border-dashed border-gray-400 p-2 rounded cursor-pointer text-xs bg-white hover:bg-gray-100 transition-colors">
        Upload Receipt / Voucher
        <input type="file" onChange={onFileChange} className="hidden" />
      </label>

      <button
        onClick={onSubmit}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded transition-colors"
      >
        Submit Payment
      </button>
    </div>
  );
};

export default LiabilitySummary;