const SaleSummaryBar = ({ totalOrderQty, rawSubtotal }) => {
  return (
    <div className="bg-base-200 p-2.5 rounded-xl border border-base-300 flex justify-between items-center text-xs">
      <div>
        <span className="text-[10px] uppercase font-semibold text-base-content/60 block">
          Total Products Qty
        </span>
        <span className="font-bold text-primary">{totalOrderQty}</span>
      </div>
      <div>
        <span className="text-[10px] uppercase font-semibold text-base-content/60 block">
          Subtotal (After Line Discounts)
        </span>
        <span className="font-bold text-teal-600">
          ৳ {rawSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

export default SaleSummaryBar;