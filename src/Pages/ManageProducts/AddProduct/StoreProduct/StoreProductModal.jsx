import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Store, Calculator, Scale } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const StoreProductModal = ({ isOpen, onClose, products, onSaveStoreProduct }) => {
  const initialItems = [
    {
      productId: "",
      productName: "",
      currentStock: 0,
      quantity: 1,
      unitPrice: 0,
      unitWeight: 1,
    },
  ];

  const initialExpenses = {
    shippingCost: 0,
    vatValue: 0,
    vatType: "percent", // 'percent' or 'amount'
    transitCost: 0,
    otherCost: 0,
  };

  const [items, setItems] = useState(initialItems);
  const [expenses, setExpenses] = useState(initialExpenses);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    if (field === "productId") {
      const selectedProd = products.find((p) => p.productId === value);
      updatedItems[index] = {
        ...updatedItems[index],
        productId: value,
        productName: selectedProd ? selectedProd.productName : "",
        currentStock: selectedProd ? selectedProd.quantity : 0,
        unitPrice: selectedProd ? selectedProd.purchasePrice || 0 : 0,
      };
    } else {
      updatedItems[index][field] = Number(value) || value;
    }

    setItems(updatedItems);
  };

  const handleAddItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: "",
        productName: "",
        currentStock: 0,
        quantity: 1,
        unitPrice: 0,
        unitWeight: 1,
      },
    ]);
  };

  const handleRemoveItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenses((prev) => ({
      ...prev,
      [name]: name === "vatType" ? value : Number(value) || 0,
    }));
  };

  // Summary Math Calculations (Dynamic VAT calculation based on Percent % or Amount ৳)
  const calculations = useMemo(() => {
    const rawSubtotal = items.reduce(
      (acc, item) => acc + (item.quantity * item.unitPrice || 0),
      0
    );

    const totalBatchWeight = items.reduce(
      (acc, item) => acc + (item.quantity * item.unitWeight || 0),
      0
    );

    // Calculate Dynamic VAT Amount
    const calculatedVatAmount =
      expenses.vatType === "percent"
        ? (rawSubtotal * (expenses.vatValue || 0)) / 100
        : expenses.vatValue || 0;

    // ALL Expenses combined
    const totalExtraExpenses =
      expenses.shippingCost +
      calculatedVatAmount +
      expenses.transitCost +
      expenses.otherCost;

    // Distribute expenses proportionately based on batch weight
    const calculatedItems = items.map((item) => {
      const itemTotalWeight = item.quantity * (item.unitWeight || 1);
      const weightRatio = totalBatchWeight > 0 ? itemTotalWeight / totalBatchWeight : 0;

      const allocatedExtraShare = totalExtraExpenses * weightRatio;
      const extraCostPerUnit = item.quantity > 0 ? allocatedExtraShare / item.quantity : 0;
      const finalUnitBuyingPrice = item.unitPrice + extraCostPerUnit;

      return {
        ...item,
        allocatedExtraShare,
        finalUnitBuyingPrice,
        totalLinePrice: item.quantity * item.unitPrice,
      };
    });

    const grandTotal = rawSubtotal + totalExtraExpenses;

    return {
      rawSubtotal,
      totalBatchWeight,
      calculatedVatAmount,
      totalExtraExpenses,
      grandTotal,
      calculatedItems,
    };
  }, [items, expenses]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasInvalidProduct = items.some((item) => !item.productId);
    if (hasInvalidProduct) {
      toast.error("Please select a product for all rows!", { autoClose: 2000 });
      return;
    }

    Swal.fire({
      title: "Confirm Purchase Batch?",
      text: "This action will update product stock levels and unit costs.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Confirm Stock!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "btn btn-sm text-white px-4 border-0",
        cancelButton: "btn btn-sm btn-ghost px-4",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onSaveStoreProduct({
          purchasedItems: calculations.calculatedItems,
          expenses: {
            ...expenses,
            vatAmount: calculations.calculatedVatAmount,
          },
          grandTotal: calculations.grandTotal,
          date: new Date().toISOString(),
        });

        toast.success("Stock Batch entry recorded successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        });

        setItems(initialItems);
        setExpenses(initialExpenses);
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-base-100 rounded-2xl shadow-2xl border border-base-300 z-10 flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-base-200 border-b border-base-300">
              <div className="flex items-center gap-2">
                <Store className="size-5 text-teal-600" />
                <h3 className="font-bold text-lg">Store / Batch Purchase Entry</h3>
              </div>
              <button type="button" onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
                <X className="size-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 grow">
              {/* Product Line Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm uppercase tracking-wide text-base-content/80">
                    Product Line Items
                  </h4>
                  <span className="text-xs text-base-content/60 font-medium">
                    Total Batch Weight: <b className="text-primary">{calculations.totalBatchWeight.toFixed(2)} kg</b>
                  </span>
                </div>

                {items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-12 gap-2 bg-base-200/50 p-3 rounded-xl border border-base-300 items-center text-xs"
                  >
                    <div className="col-span-12 sm:col-span-3">
                      <label className="label py-0 text-[10px] font-semibold text-base-content/60">
                        Select Product
                      </label>
                      <select
                        required
                        value={item.productId}
                        onChange={(e) => handleItemChange(idx, "productId", e.target.value)}
                        className="select select-bordered select-sm w-full font-medium"
                      >
                        <option value="">Choose product...</option>
                        {products.map((p) => (
                          <option key={p.productId} value={p.productId}>
                            {p.productName} ({p.productId})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-4 sm:col-span-1 text-center">
                      <label className="label py-0 text-[10px] font-semibold text-base-content/60">
                        Stock
                      </label>
                      <span className="badge badge-ghost badge-sm w-full font-semibold">
                        {item.currentStock}
                      </span>
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="label py-0 text-[10px] font-semibold text-base-content/60">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        className="input input-bordered input-sm w-full font-semibold"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="label py-0 text-[10px] font-semibold text-base-content/60">
                        Unit Price (৳)
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label className="label py-0 text-[10px] font-semibold text-base-content/60 flex items-center gap-1">
                        <Scale className="size-3" /> Wt / Unit (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitWeight}
                        onChange={(e) => handleItemChange(idx, "unitWeight", e.target.value)}
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-1 text-right">
                      <label className="label py-0 text-[10px] font-semibold text-base-content/60">
                        Total
                      </label>
                      <span className="font-bold text-sm text-primary block py-1">
                        ৳ {(item.quantity * item.unitPrice || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 flex justify-center pt-3 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={items.length === 1}
                        className="btn btn-square btn-ghost btn-xs text-error disabled:opacity-30"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="btn btn-outline btn-primary btn-sm w-full border-dashed gap-2"
                >
                  <Plus className="size-4" /> Add Another Product Item
                </button>
              </div>

              {/* Extra Expenses Breakdown & Calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-base-300">
                <div className="space-y-3 bg-base-200/40 p-4 rounded-xl border border-base-300">
                  <h5 className="font-bold text-xs uppercase text-base-content/70 flex items-center gap-1.5">
                    <Calculator className="size-4" /> Extra Expenses Breakdown
                  </h5>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label text-xs font-semibold">Shipping Cost (৳)</label>
                      <input
                        type="number"
                        name="shippingCost"
                        value={expenses.shippingCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                    <div>
                      <label className="label text-xs font-semibold">Transit Cost (৳)</label>
                      <input
                        type="number"
                        name="transitCost"
                        value={expenses.transitCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    {/* VAT Input with Dynamic Percent / Amount Dropdown */}
                    <div>
                      <label className="label text-xs font-semibold">
                        VAT {expenses.vatType === "percent" ? "(%)" : "(৳)"}
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          name="vatValue"
                          value={expenses.vatValue}
                          onChange={handleExpenseChange}
                          placeholder={expenses.vatType === "percent" ? "e.g. 15%" : "Amount"}
                          className="input input-bordered input-sm w-full"
                        />
                        <select
                          name="vatType"
                          value={expenses.vatType}
                          onChange={handleExpenseChange}
                          className="select select-bordered select-sm font-bold text-primary"
                        >
                          <option value="percent">%</option>
                          <option value="amount">৳</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="label text-xs font-semibold">Other Expenses (৳)</label>
                      <input
                        type="number"
                        name="otherCost"
                        value={expenses.otherCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation Summary Card */}
                <div className="bg-base-200/70 p-4 rounded-xl border border-base-300 flex flex-col justify-between space-y-2">
                  <h5 className="font-bold text-xs uppercase text-base-content/70">
                    Grand Purchase Calculation
                  </h5>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-base-content/70">
                      <span>Products Subtotal:</span>
                      <span className="font-semibold">
                        ৳ {calculations.rawSubtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-base-content/60 text-[11px] pl-2 border-l-2 border-primary/30 my-0.5">
                      <span>• Shipping Cost:</span>
                      <span>৳ {expenses.shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base-content/60 text-[11px] pl-2 border-l-2 border-primary/30 my-0.5">
                      <span>• Transit Cost:</span>
                      <span>৳ {expenses.transitCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base-content/60 text-[11px] pl-2 border-l-2 border-primary/30 my-0.5">
                      <span>
                        • VAT Amount ({expenses.vatType === "percent" ? `${expenses.vatValue || 0}%` : "Fixed"}):
                      </span>
                      <span>৳ {calculations.calculatedVatAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base-content/60 text-[11px] pl-2 border-l-2 border-primary/30 my-0.5">
                      <span>• Other Expenses:</span>
                      <span>৳ {expenses.otherCost.toLocaleString()}</span>
                    </div>

                    <div className="divider my-1"></div>
                    <div className="flex justify-between text-base font-bold text-teal-600">
                      <span>Grand Total Cost:</span>
                      <span>৳ {calculations.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-[11px] bg-teal-500/10 text-teal-700 dark:text-teal-400 p-2 rounded-lg border border-teal-500/20 mt-2">
                    💡 VAT is dynamic ({expenses.vatType === "percent" ? "% calculated on subtotal" : "flat amount"}) & distributed across products.
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
                <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn text-white bg-teal-600 hover:bg-teal-700 btn-sm px-6 border-0"
                >
                  Confirm Stock Entry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StoreProductModal;