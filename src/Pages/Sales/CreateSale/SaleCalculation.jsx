import { Calculator } from "lucide-react";

const SaleCalculation = ({
  globalDiscount,
  setGlobalDiscount,
  paidAmount,
  setPaidAmount,
  calculations,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
      {/* General Discount & Payments Input */}
      <div className="space-y-2 bg-base-200/40 p-3 rounded-xl border border-base-300">
        <h5 className="font-bold text-xs uppercase text-base-content/70 flex items-center gap-1.5">
          <Calculator className="size-4" /> General Discount & Payments
        </h5>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="label py-0.5 text-[11px] font-semibold">
              Discount Type & Value
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                min="0"
                value={globalDiscount.value}
                onChange={(e) =>
                  setGlobalDiscount((prev) => ({
                    ...prev,
                    value: e.target.value === "" ? "" : Number(e.target.value),
                  }))
                }
                placeholder={globalDiscount.type === "percent" ? "%" : "৳"}
                className="input input-bordered input-xs w-full"
              />
              <select
                value={globalDiscount.type}
                onChange={(e) =>
                  setGlobalDiscount((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                className="select select-bordered select-xs font-bold text-teal-600"
              >
                <option value="percent">%</option>
                <option value="amount">৳</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label py-0.5 text-[11px] font-semibold">
              Paid Amount (৳)
            </label>
            <input
              type="number"
              min="0"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="input input-bordered input-xs w-full font-bold text-success"
            />
          </div>
        </div>
      </div>

      {/* Grand Order Calculation Box */}
      <div className="bg-base-200/70 p-3 rounded-xl border border-base-300 flex flex-col justify-between space-y-1">
        <h5 className="font-bold text-xs uppercase text-base-content/70">
          Grand Order Calculation
        </h5>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-base-content/70">
            <span>Items Subtotal:</span>
            <span className="font-semibold">৳ {calculations.rawSubtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-base-content/60 text-[11px] pl-2 border-l-2 border-teal-500/40">
            <span>
              • General Discount ({globalDiscount.type === "percent" ? `${globalDiscount.value || 0}%` : `৳${globalDiscount.value || 0}`}):
            </span>
            <span>- ৳ {calculations.globalDiscountAmount.toLocaleString()}</span>
          </div>

          <div className="divider my-1"></div>
          <div className="flex justify-between text-sm font-bold text-teal-600">
            <span>Grand Total:</span>
            <span>
              ৳ {calculations.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between text-xs font-semibold text-success pt-0.5">
            <span>Paid Amount:</span>
            <span>৳ {(Number(paidAmount) || 0).toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-xs font-bold text-error pt-0.5">
            <span>Due Amount:</span>
            <span>
              ৳ {calculations.dueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleCalculation;