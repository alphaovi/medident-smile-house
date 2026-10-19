// PurchaseOrderModal.jsx
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Store,
  Calculator,
  Box,
  Calendar,
  Building2,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { supplierService } from "../../../../services/supplierService/supplierService";
import { useQueryClient } from "@tanstack/react-query";

const PurchaseOrderModal = ({
  isOpen,
  onClose,
  onSaveStoreProduct,
}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productGroups, setProductGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const queryClient = useQueryClient();

  const getTodayISO = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [orderDate, setOrderDate] = useState(getTodayISO());
  const [expectedReceiveDate, setExpectedReceiveDate] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchModalData = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || "https://alphaovi-medident-backend.vercel.app/api/v1";
      setLoadingSuppliers(true);
      
      try {
        const [supRes, prodRes, groupRes, subGroupRes, invRes] = await Promise.all([
          supplierService.getAllSuppliers().catch(() => []),
          fetch(`${baseUrl}/products`).catch(() => ({ ok: false })),
          fetch(`${baseUrl}/product-groups`).catch(() => ({ ok: false })),
          fetch(`${baseUrl}/product-subgroups`).catch(() => ({ ok: false })),
          fetch(`${baseUrl}/inventory`).catch(() => ({ ok: false }))
        ]);

        let supData = supRes;
        if (supRes && typeof supRes.json === "function") {
          supData = await supRes.json();
        }
        setSuppliers(Array.isArray(supData) ? supData : (supData?.data || supData?.result || []));

        const prodData = prodRes.ok ? await prodRes.json() : [];
        setProducts(Array.isArray(prodData) ? prodData : (prodData?.data || prodData?.result || []));

        const groupData = groupRes.ok ? await groupRes.json() : [];
        setProductGroups(Array.isArray(groupData) ? groupData : (groupData?.data || groupData?.result || []));
        
        const subGroupData = subGroupRes.ok ? await subGroupRes.json() : [];
        setSubGroups(Array.isArray(subGroupData) ? subGroupData : (subGroupData?.data || subGroupData?.result || []));

        const invData = invRes.ok ? await invRes.json() : [];
        setInventories(Array.isArray(invData) ? invData : (invData?.data || invData?.result || []));

      } catch (err) {
        console.error("Error fetching modal options:", err);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    fetchModalData();
  }, [isOpen]);

  const initialRow = {
    selectedGroup: "",
    selectedSubGroup: "",
    productId: "",
    productName: "",
    currentStock: 0,
    transitStock: 0,
    orderQty: 1,
    unitPrice: 0,
    unitWeight: 1,
  };

  const initialExpenses = {
    shippingCost: 0,
    vatInput: "0",
    transitCost: 0,
    otherCost: 0,
  };

  const [items, setItems] = useState([initialRow]);
  const [expenses, setExpenses] = useState(initialExpenses);

  useEffect(() => {
    if (!isOpen) {
      setItems([{ ...initialRow }]);
      setExpenses(initialExpenses);
      setSelectedSupplier("");
      setOrderDate(getTodayISO());
      setExpectedReceiveDate("");
    }
  }, [isOpen]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    const currentRow = { ...updatedItems[index] };

    if (field === "selectedGroup") {
      currentRow.selectedGroup = value;
      currentRow.selectedSubGroup = "";
      currentRow.productId = "";
      currentRow.productName = "";
      currentRow.currentStock = 0;
      currentRow.transitStock = 0;
      currentRow.unitPrice = 0;
    } else if (field === "selectedSubGroup") {
      currentRow.selectedSubGroup = value;
      currentRow.productId = "";
      currentRow.productName = "";
      currentRow.currentStock = 0;
      currentRow.transitStock = 0;
      currentRow.unitPrice = 0;
    } else if (field === "productId") {
      currentRow.productId = value;
      const selectedProd = products.find(
        (p) => String(p._id || p.productId || p.id) === String(value)
      );

      const matchedInventory = inventories.find(
        (inv) => String(inv.product?._id || inv.product) === String(value)
      );

      if (selectedProd || matchedInventory) {
        currentRow.productName = selectedProd?.productName || selectedProd?.name || "";
        currentRow.currentStock = matchedInventory?.currentStock ?? selectedProd?.quantity ?? selectedProd?.currentStock ?? 0;
        currentRow.transitStock = matchedInventory?.onTransit ?? matchedInventory?.transitStock ?? selectedProd?.inTransit ?? 0;
        currentRow.unitPrice = selectedProd?.purchasePrice ?? selectedProd?.unitPrice ?? 0;
        currentRow.unitWeight = selectedProd?.unitWeight ?? selectedProd?.weight ?? 1;
      }
    } else if (["orderQty", "unitPrice", "unitWeight"].includes(field)) {
      currentRow[field] = value === "" ? "" : Number(value);
    }

    updatedItems[index] = currentRow;

    if (field === "productId" && value !== "" && index === items.length - 1) {
      updatedItems.push({ ...initialRow });
    }

    setItems(updatedItems);
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
      [name]: name === "vatInput" ? value : (value === "" ? "" : Number(value)),
    }));
  };

  const calculations = useMemo(() => {
    const activeItems = items.filter((item) => item.productId !== "");

    const rawSubtotal = activeItems.reduce(
      (acc, item) =>
        acc + (Number(item.orderQty) || 0) * (Number(item.unitPrice) || 0),
      0
    );

    const totalBatchWeight = activeItems.reduce(
      (acc, item) =>
        acc + (Number(item.orderQty) || 0) * (Number(item.unitWeight) || 0),
      0
    );

    const shippingCostNum = Number(expenses.shippingCost) || 0;
    const transitCostNum = Number(expenses.transitCost) || 0;
    const otherCostNum = Number(expenses.otherCost) || 0;

    const shippingCostPerKg = totalBatchWeight > 0 ? shippingCostNum / totalBatchWeight : 0;
    const transitCostPerKg = totalBatchWeight > 0 ? transitCostNum / totalBatchWeight : 0;
    const otherCostPerKg = totalBatchWeight > 0 ? otherCostNum / totalBatchWeight : 0;

    const vatStr = String(expenses.vatInput || "0").trim();
    const isPercent = vatStr.includes("%");
    const vatValNum = Number(vatStr.replace("%", "")) || 0;

    const calculatedVatAmount = isPercent
      ? (rawSubtotal * vatValNum) / 100
      : vatValNum;

    const calculatedItems = items.map((item) => {
      if (!item.productId) return item;

      const qty = Number(item.orderQty) || 0;
      const unitWt = Number(item.unitWeight) || 0;
      const uPrice = Number(item.unitPrice) || 0;

      const lineWeight = qty * unitWt;
      const allocatedShipping = lineWeight * shippingCostPerKg;
      const allocatedTransit = lineWeight * transitCostPerKg;
      const allocatedOther = lineWeight * otherCostPerKg;

      const rawLinePrice = qty * uPrice;
      const allocatedVat =
        rawSubtotal > 0
          ? (rawLinePrice / rawSubtotal) * calculatedVatAmount
          : 0;

      const totalWithShippingAndVat =
        rawLinePrice + allocatedShipping + allocatedTransit + allocatedOther + allocatedVat;
      const unitCostAfterCalc = qty > 0 ? totalWithShippingAndVat / qty : 0;

      return {
        ...item,
        lineWeight,
        allocatedShipping,
        allocatedTransit,
        allocatedOther,
        allocatedVat,
        rawLinePrice,
        totalWithShipping: totalWithShippingAndVat,
        unitCostAfterCalc,
      };
    });

    const totalItemsWithShipping = calculatedItems
      .filter((item) => item.productId !== "")
      .reduce((acc, item) => acc + (item.totalWithShipping || 0), 0);

    const grandTotal = totalItemsWithShipping;

    return {
      rawSubtotal,
      shippingCostPerKg,
      transitCostPerKg,
      otherCostPerKg,
      grandTotal,
      calculatedItems,
      totalBatchWeight,
      vatValNum,
      isPercent,
    };
  }, [items, expenses]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validItems = calculations.calculatedItems.filter(
      (item) => item.productId !== ""
    );

    if (validItems.length === 0) {
      toast.error("Please select at least one product!", { autoClose: 2500 });
      return;
    }

    if (!selectedSupplier) {
      toast.error("Please select a supplier!", { autoClose: 2500 });
      return;
    }

    Swal.fire({
      title: "Confirm Purchase Order?",
      text: "This will create a new batch order and calculate average buying price in inventory.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Confirm Order",
      cancelButtonText: "Cancel",
      heightAuto: false,
      customClass: {
        container: "z-[99999]",
        popup: "rounded-2xl p-6 shadow-2xl border border-base-200",
        title: "text-xl font-bold text-base-content",
        htmlContainer: "text-sm text-base-content/70",
        confirmButton: "btn btn-sm bg-teal-600 hover:bg-teal-700 text-white px-5 border-0 shadow-none",
        cancelButton: "btn btn-sm btn-ghost px-5 text-base-content/70 hover:bg-base-200",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          purchaseId: `PO-${Date.now().toString().slice(-6)}`,
          purchaseDate: orderDate ? new Date(orderDate).toISOString() : new Date().toISOString(),
          expectedDeliveryDate: expectedReceiveDate ? new Date(expectedReceiveDate).toISOString() : new Date().toISOString(),
          supplierName: selectedSupplier,
          shippingCost: Number(expenses.shippingCost) || 0,
          transitCost: Number(expenses.transitCost) || 0,
          vatType: calculations.isPercent ? "%" : "flat",
          vatValue: calculations.vatValNum,
          otherCost: Number(expenses.otherCost) || 0,
          totalWeight: calculations.totalBatchWeight || 0,
          baseSubtotal: calculations.rawSubtotal,
          grandTotal: calculations.grandTotal,
          items: validItems.map((item) => ({
            group: item.selectedGroup,
            subGroup: item.selectedSubGroup,
            product: item.productId,
            currentStock: Number(item.currentStock) || 0,
            inTransit: Number(item.transitStock) || 0,
            orderQuantity: Number(item.orderQty) || 0,
            price: Number(item.unitPrice) || 0,
            weight: Number(item.unitWeight) || 0,
            shippingCost: Number(item.allocatedShipping) || 0,
            vatAmount: Number(item.allocatedVat) || 0,
            transitCost: Number(item.allocatedTransit) || 0,
            otherCost: Number(item.allocatedOther) || 0,
            unitCost: Number(item.unitCostAfterCalc || item.unitPrice) || 0,
            totalCost: Number(item.totalWithShipping || (item.orderQty * item.unitPrice)) || 0,
            status: "Ordered",
          })),
          status: "Ordered",
        };

        onSaveStoreProduct?.(payload);
        queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
        queryClient.invalidateQueries({ queryKey: ["inventories"] });
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            className="relative w-full max-w-6xl h-[90vh] bg-base-100 rounded-2xl shadow-2xl border border-base-300 z-10 flex flex-col overflow-hidden text-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-base-200 border-b border-base-300 shrink-0">
              <div className="flex items-center gap-2">
                <Store className="size-6 text-teal-600" />
                <h3 className="font-bold text-xl">Create Purchase Order</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit}
              className="p-5 overflow-y-auto space-y-5 grow"
            >
              {/* Supplier & Dates Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-200/50 p-4 rounded-xl border border-base-300">
                <div>
                  <label className="label py-1 text-sm font-semibold flex items-center gap-2 text-base-content/80">
                    <Building2 className="size-4 text-teal-600" /> Supplier
                  </label>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="select select-bordered select-sm w-full font-medium text-sm"
                    required
                    disabled={loadingSuppliers}
                  >
                    <option value="">
                      {loadingSuppliers ? "Loading suppliers..." : "Select Supplier..."}
                    </option>
                    {suppliers.map((sup) => {
                      const supId = sup._id || sup.supplierId;
                      const supName = sup.supplierName || sup.name;
                      return (
                        <option key={supId} value={supId}>
                          {supName} {sup.supplierId ? `(${sup.supplierId})` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="label py-1 text-sm font-semibold flex items-center gap-2 text-base-content/80">
                    <Calendar className="size-4 text-teal-600" /> Order Date
                  </label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="input input-bordered input-sm w-full font-medium text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="label py-1 text-sm font-semibold flex items-center gap-2 text-base-content/80">
                    <Calendar className="size-4 text-teal-600" /> Expected Receive Date
                  </label>
                  <input
                    type="date"
                    value={expectedReceiveDate}
                    onChange={(e) => setExpectedReceiveDate(e.target.value)}
                    className="input input-bordered input-sm w-full font-medium text-sm"
                    required
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/80 flex items-center gap-2">
                    <Box className="size-5" /> Item Details
                  </h4>
                  <span className="text-sm text-base-content/70 font-medium">
                    Shipping Rate:{" "}
                    <b className="text-teal-600">
                      ৳ {calculations.shippingCostPerKg.toFixed(2)} / kg
                    </b>
                  </span>
                </div>

                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-base-300/40 rounded-lg text-xs font-bold text-base-content/80 text-center">
                  <div className="w-40 text-left">Group</div>
                  <div className="w-40 text-left">Sub-Group</div>
                  <div className="flex-1 text-left">Product</div>
                  <div className="w-20">Cur. Stock</div>
                  <div className="w-20">In Transit</div>
                  <div className="w-20">Order Qty</div>
                  <div className="w-24">Price (৳)</div>
                  <div className="w-20">Wt (kg)</div>
                  <div className="w-28 text-right">Unit Cost</div>
                  <div className="w-28 text-right">Total + Ship</div>
                  <div className="w-10"></div>
                </div>

                {items.map((item, idx) => {
                  const availableSubGroups = subGroups.filter((sg) => {
                    const parentGroupId = sg.group?._id || sg.group;
                    return String(parentGroupId) === String(item.selectedGroup);
                  });

                  const filteredProducts = products.filter((p) => {
                    const pGroup = p.group?._id || p.group || p.productGroup;
                    const pSubGroup = p.subGroup?._id || p.subGroup || p.productSubGroup;

                    const matchGroup = !item.selectedGroup || String(pGroup) === String(item.selectedGroup);
                    const matchSubGroup = !item.selectedSubGroup || String(pSubGroup) === String(item.selectedSubGroup);

                    return matchGroup && matchSubGroup;
                  });

                  const calcItem = calculations.calculatedItems[idx];

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-wrap lg:flex-nowrap items-center gap-3 bg-base-200/50 p-3 rounded-xl border border-base-300 text-sm"
                    >
                      <div className="w-full sm:w-40">
                        <select
                          value={item.selectedGroup}
                          onChange={(e) => handleItemChange(idx, "selectedGroup", e.target.value)}
                          className="select select-bordered select-sm w-full text-sm"
                        >
                          <option value="">Group...</option>
                          {productGroups.map((g) => {
                            const gId = g._id || g.id;
                            const gName = g.groupName || g.name;
                            return (
                              <option key={gId} value={gId}>
                                {gName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="w-full sm:w-40">
                        <select
                          value={item.selectedSubGroup}
                          disabled={!item.selectedGroup}
                          onChange={(e) => handleItemChange(idx, "selectedSubGroup", e.target.value)}
                          className="select select-bordered select-sm w-full disabled:opacity-50 text-sm"
                        >
                          <option value="">Sub-Group...</option>
                          {availableSubGroups.map((sg) => {
                            const sgId = sg._id || sg.id;
                            const sgName = sg.subGroupName || sg.name;
                            return (
                              <option key={sgId} value={sgId}>
                                {sgName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="flex-1 min-w-[120px]">
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(idx, "productId", e.target.value)}
                          className="select select-bordered select-sm w-full font-medium text-sm"
                        >
                          <option value="">Select Product...</option>
                          {filteredProducts.map((p) => {
                            const pId = p._id || p.productId || p.id;
                            const pName = p.productName || p.name;
                            return (
                              <option key={pId} value={pId}>
                                {pName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="w-20 text-center">
                        <span className="badge badge-ghost badge-md w-full font-medium text-xs py-2">
                          {item.currentStock}
                        </span>
                      </div>

                      <div className="w-20 text-center">
                        <span className="badge badge-warning/20 text-warning-content badge-md w-full font-medium text-xs py-2">
                          {item.transitStock}
                        </span>
                      </div>

                      <div className="w-20">
                        <input
                          type="number"
                          min="0"
                          value={item.orderQty}
                          onChange={(e) => handleItemChange(idx, "orderQty", e.target.value)}
                          className="input input-bordered input-sm w-full text-center font-bold text-sm"
                        />
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                          className="input input-bordered input-sm w-full text-right text-sm"
                        />
                      </div>

                      <div className="w-20">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitWeight}
                          onChange={(e) => handleItemChange(idx, "unitWeight", e.target.value)}
                          className="input input-bordered input-sm w-full text-center text-sm"
                        />
                      </div>

                      <div className="w-28 text-right">
                        <span className="font-bold text-sm text-info block px-1">
                          ৳ {calcItem?.unitCostAfterCalc ? calcItem.unitCostAfterCalc.toFixed(2) : "0.00"}
                        </span>
                      </div>

                      <div className="w-28 text-right">
                        <span className="font-bold text-sm text-teal-600 block px-1">
                          ৳ {calcItem?.totalWithShipping ? calcItem.totalWithShipping.toFixed(2) : "0.00"}
                        </span>
                      </div>

                      <div className="w-10 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          disabled={items.length === 1}
                          className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10 disabled:opacity-20"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary & Expenses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-3 bg-base-200/40 p-4 rounded-xl border border-base-300">
                  <h5 className="font-bold text-sm uppercase text-base-content/80 flex items-center gap-2">
                    <Calculator className="size-5" /> Expenses Breakdown
                  </h5>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <label className="label py-1 text-xs font-semibold">Shipping Cost (৳)</label>
                      <input
                        type="number"
                        name="shippingCost"
                        value={expenses.shippingCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="label py-1 text-xs font-semibold">Transit Cost (৳)</label>
                      <input
                        type="number"
                        name="transitCost"
                        value={expenses.transitCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full text-sm"
                      />
                    </div>

                    <div>
                      <label className="label py-1 text-xs font-semibold">VAT (e.g. 5% or 50)</label>
                      <input
                        type="text"
                        name="vatInput"
                        placeholder="e.g. 5% or 50"
                        value={expenses.vatInput}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full text-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="label py-1 text-xs font-semibold">Other Cost (৳)</label>
                      <input
                        type="number"
                        name="otherCost"
                        value={expenses.otherCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-base-200/70 p-4 rounded-xl border border-base-300 flex flex-col justify-between space-y-2">
                  <h5 className="font-bold text-sm uppercase text-base-content/80">
                    Grand Order Calculation
                  </h5>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-base-content/80">
                      <span>Base Subtotal:</span>
                      <span className="font-semibold">৳ {calculations.rawSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="divider my-1"></div>
                    <div className="flex justify-between text-base font-bold text-teal-600">
                      <span>Grand Total:</span>
                      <span>
                        ৳ {calculations.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions justify-end pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-sm btn-ghost text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white text-sm px-5"
                    >
                      Save Order
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseOrderModal;