// EditPurchaseOrderModal.jsx
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

const EditPurchaseOrderModal = ({
  isOpen,
  onClose,
  products = [],
  productsGroupSubgroup = [],
  onSaveStoreProduct,
  editData = null,
}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");

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
    fetch("/suppliersData.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch suppliers");
        return res.json();
      })
      .then((data) => {
        setSuppliers(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
    vatValue: 0,
    vatType: "percent",
    transitCost: 0,
    otherCost: 0,
  };

  const [items, setItems] = useState([initialRow]);
  const [expenses, setExpenses] = useState(initialExpenses);

  // Populate data when editing with robust group, subgroup, and product matching
  useEffect(() => {
    if (editData) {
      // Resolve Supplier Name correctly (handle both string name or object/id reference)
      const supMatch = suppliers.find(
        (s) => String(s._id) === String(editData.supplierName || editData.supplier) ||
               String(s.supplierName) === String(editData.supplierName || editData.supplier)
      );
      setSelectedSupplier(supMatch ? supMatch.supplierName : (editData.supplierName || editData.supplier || ""));

      if (editData.orderDate) {
        if (editData.orderDate.includes("/")) {
          const parts = editData.orderDate.split("/");
          if (parts.length === 3) {
            setOrderDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        } else {
          setOrderDate(editData.orderDate.split("T")[0]);
        }
      }

      const expDate = editData.expectedReceiveDate || editData.expectedDate || editData.expectedDeliveryDate;
      if (expDate) {
        if (expDate.includes("/")) {
          const parts = expDate.split("/");
          if (parts.length === 3) {
            setExpectedReceiveDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        } else {
          setExpectedReceiveDate(expDate.split("T")[0]);
        }
      }

      if (editData.expenses) {
        setExpenses({
          shippingCost:
            editData.expenses.shippingCost ?? editData.expenses.shipping ?? 0,
          transitCost:
            editData.expenses.transitCost ?? editData.expenses.transit ?? 0,
          vatValue: editData.expenses.vatValue ?? editData.expenses.vat ?? 0,
          vatType:
            editData.expenses.vatType ||
            (editData.expenses.vat ? "amount" : "percent"),
          otherCost:
            editData.expenses.otherCost ?? editData.expenses.other ?? 0,
        });
      }

      const rawItems =
        editData.purchasedItems || editData.products || editData.items || [];
      if (rawItems.length > 0) {
        const mappedItems = rawItems.map((item) => {
          const prodMatch = products.find(
            (p) =>
              String(p.productId || p._id || p.id) ===
                String(item.productId || item.product || item._id || item.id) ||
              String(p.productName || p.name || "")
                .trim()
                .toLowerCase() ===
                String(item.productName || item.name || "")
                  .trim()
                  .toLowerCase(),
          );

          // Resolve Group Name instead of showing _id
          const rawGroupRef = item.selectedGroup || item.group || prodMatch?.productGroup || prodMatch?.group || "";
          const groupObj = productsGroupSubgroup.find(
            (g) => String(g._id) === String(rawGroupRef) || String(g.group || g.groupName || g.name) === String(rawGroupRef)
          );
          const resolvedGroup = groupObj ? (groupObj.group || groupObj.groupName || groupObj.name) : rawGroupRef;

          // Resolve SubGroup Name instead of showing _id
          const rawSubGroupRef = item.selectedSubGroup || item.subGroup || prodMatch?.productSubGroup || prodMatch?.subGroup || "";
          const subGroupsList = groupObj?.subGroup || groupObj?.subGroups || [];
          const subGroupObj = subGroupsList.find(
            (sg) => String(sg._id) === String(rawSubGroupRef) || String(sg.name || sg) === String(rawSubGroupRef)
          );
          const resolvedSubGroup = subGroupObj ? (subGroupObj.name || subGroupObj) : rawSubGroupRef;

          const resolvedProductId = prodMatch
            ? prodMatch.productId || prodMatch._id || prodMatch.id || ""
            : item.productId || item.product || item._id || item.id || "";

          const resolvedProductName =
            item.productName ||
            item.name ||
            prodMatch?.productName ||
            prodMatch?.name ||
            "";

          return {
            selectedGroup: resolvedGroup,
            selectedSubGroup: resolvedSubGroup,
            productId: resolvedProductId,
            productName: resolvedProductName,
            currentStock:
              item.currentStock ??
              prodMatch?.quantity ??
              prodMatch?.currentStock ??
              0,
            transitStock:
              item.inTransit ??
              item.transitStock ??
              prodMatch?.inTransit ??
              prodMatch?.transitStock ??
              0,
            orderQty: item.orderQuantity ?? item.orderQty ?? item.quantity ?? 1,
            unitPrice:
              item.unitPrice ??
              prodMatch?.purchasePrice ??
              prodMatch?.unitPrice ??
              0,
            unitWeight:
              item.weight ??
              item.unitWeight ??
              prodMatch?.unitWeight ??
              prodMatch?.weight ??
              1,
          };
        });
        mappedItems.push({ ...initialRow });
        setItems(mappedItems);
      }
    } else {
      setItems([{ ...initialRow }]);
      setExpenses(initialExpenses);
      setSelectedSupplier("");
      setOrderDate(getTodayISO());
      setExpectedReceiveDate("");
    }
  }, [editData, products, productsGroupSubgroup, suppliers]);

  const availableGroups = useMemo(() => {
    if (!Array.isArray(productsGroupSubgroup)) return [];
    return productsGroupSubgroup
      .map((item) => item.group || item.groupName || item.name)
      .filter(Boolean);
  }, [productsGroupSubgroup]);

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
        (p) => String(p.productId || p._id || p.id) === String(value),
      );
      if (selectedProd) {
        currentRow.productName =
          selectedProd.productName || selectedProd.name || "";
        currentRow.currentStock =
          selectedProd.quantity ?? selectedProd.currentStock ?? 0;
        currentRow.transitStock =
          selectedProd.inTransit ?? selectedProd.transitStock ?? 0;
        currentRow.unitPrice =
          selectedProd.purchasePrice ?? selectedProd.unitPrice ?? 0;
        currentRow.unitWeight =
          selectedProd.unitWeight ?? selectedProd.weight ?? 1;
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

  const calculations = useMemo(() => {
    const activeItems = items.filter((item) => item.productId !== "");

    const totalCurrentStock = activeItems.reduce(
      (acc, item) => acc + (Number(item.currentStock) || 0),
      0,
    );
    const totalTransitStock = activeItems.reduce(
      (acc, item) => acc + (Number(item.transitStock) || 0),
      0,
    );
    const totalOrderQty = activeItems.reduce(
      (acc, item) => acc + (Number(item.orderQty) || 0),
      0,
    );

    const rawSubtotal = activeItems.reduce(
      (acc, item) =>
        acc + (Number(item.orderQty) || 0) * (Number(item.unitPrice) || 0),
      0,
    );

    const totalBatchWeight = activeItems.reduce(
      (acc, item) =>
        acc + (Number(item.orderQty) || 0) * (Number(item.unitWeight) || 0),
      0,
    );

    const shippingCostNum = Number(expenses.shippingCost) || 0;
    const shippingCostPerKg =
      totalBatchWeight > 0 ? shippingCostNum / totalBatchWeight : 0;

    const vatValNum = Number(expenses.vatValue) || 0;
    const calculatedVatAmount =
      expenses.vatType === "percent"
        ? (rawSubtotal * vatValNum) / 100
        : vatValNum;

    const calculatedItems = items.map((item) => {
      if (!item.productId) return item;

      const qty = Number(item.orderQty) || 0;
      const unitWt = Number(item.unitWeight) || 0;
      const uPrice = Number(item.unitPrice) || 0;

      const lineWeight = qty * unitWt;
      const allocatedShipping = lineWeight * shippingCostPerKg;
      const rawLinePrice = qty * uPrice;
      const allocatedVat =
        rawSubtotal > 0
          ? (rawLinePrice / rawSubtotal) * calculatedVatAmount
          : 0;

      const totalWithShippingAndVat =
        rawLinePrice + allocatedShipping + allocatedVat;
      const unitCostAfterCalc = qty > 0 ? totalWithShippingAndVat / qty : 0;

      return {
        ...item,
        lineWeight,
        allocatedShipping,
        allocatedVat,
        rawLinePrice,
        totalWithShipping: totalWithShippingAndVat,
        unitCostAfterCalc,
      };
    });

    const totalItemsWithShipping = calculatedItems
      .filter((item) => item.productId !== "")
      .reduce((acc, item) => acc + (item.totalWithShipping || 0), 0);

    const transitCostNum = Number(expenses.transitCost) || 0;
    const otherCostNum = Number(expenses.otherCost) || 0;
    const totalExtraExpenses = transitCostNum + otherCostNum;
    const grandTotal = totalItemsWithShipping + totalExtraExpenses;

    return {
      totalCurrentStock,
      totalTransitStock,
      totalOrderQty,
      rawSubtotal,
      totalItemsWithShipping,
      totalBatchWeight,
      shippingCostPerKg,
      calculatedVatAmount,
      totalExtraExpenses,
      grandTotal,
      calculatedItems,
    };
  }, [items, expenses]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validItems = calculations.calculatedItems.filter(
      (item) => item.productId !== "",
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
      title: editData ? "Update Purchase Order?" : "Confirm Purchase Order?",
      text: editData
        ? "This will update the existing batch order."
        : "This will create a new batch order with weight allocation.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#64748b",
      confirmButtonText: editData ? "Update Batch" : "Confirm Batch",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "btn btn-sm text-white px-4 border-0",
        cancelButton: "btn btn-sm btn-ghost px-4",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Map payload matching backend schema requirements
        const payloadData = {
          ...(editData || {}),
          supplierName: selectedSupplier,
          purchaseDate: orderDate,
          expectedDeliveryDate: expectedReceiveDate,
          shippingCost: Number(expenses.shippingCost) || 0,
          transitCost: Number(expenses.transitCost) || 0,
          vatType: expenses.vatType === "amount" ? "flat" : expenses.vatType,
          vatValue: Number(expenses.vatValue) || 0,
          otherCost: Number(expenses.otherCost) || 0,
          totalWeight: calculations.totalBatchWeight,
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
            transitCost: 0,
            otherCost: 0,
            unitCost: Number(item.unitCostAfterCalc) || 0,
            totalCost: Number(item.totalWithShipping) || 0,
            status: editData?.status || "Ordered",
          })),
        };

        onSaveStoreProduct?.(payloadData);
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[10px_20px]">
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
            className="relative w-full h-full max-w-none max-h-none bg-base-100 rounded-2xl shadow-2xl border border-base-300 z-10 flex flex-col overflow-hidden text-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-base-200 border-b border-base-300 shrink-0">
              <div className="flex items-center gap-2">
                <Store className="size-6 text-teal-600" />
                <h3 className="font-bold text-xl">
                  {editData
                    ? `Edit Purchase Order (${editData.purchaseId || editData.orderID || editData.orderNo || editData._id || ""})`
                    : "Batch Purchase Order Entry"}
                </h3>
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
              {/* Supplier & Dates Selection Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-200/50 p-4 rounded-xl border border-base-300">
                <div>
                  <label className="label py-1 text-sm font-semibold flex items-center gap-2 text-base-content/80">
                    <Building2 className="size-4 text-teal-600" /> Supplier Name
                  </label>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="select select-bordered select-sm w-full font-medium text-sm"
                    required
                  >
                    <option value="">Select Supplier...</option>
                    {suppliers.map((sup) => (
                      <option
                        key={sup.supplierID || sup._id}
                        value={sup.supplierName}
                      >
                        {sup.supplierName}
                      </option>
                    ))}
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
                  const matchedGroupObj = Array.isArray(productsGroupSubgroup)
                    ? productsGroupSubgroup.find(
                        (g) =>
                          (g.group || g.groupName || g.name) ===
                          item.selectedGroup,
                      )
                    : null;

                  const availableSubGroups = matchedGroupObj
                    ? matchedGroupObj.subGroup ||
                      matchedGroupObj.subGroups ||
                      []
                    : [];

                  const filteredProducts = products.filter((p) => {
                    const matchGroup =
                      !item.selectedGroup ||
                      p.productGroup === item.selectedGroup ||
                      p.group === item.selectedGroup;

                    const matchSubGroup =
                      !item.selectedSubGroup ||
                      p.productSubGroup === item.selectedSubGroup ||
                      p.subGroup === item.selectedSubGroup;

                    return matchGroup && matchSubGroup;
                  });

                  return (
                    <div
                      key={idx}
                      className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 p-3 lg:p-0 bg-base-200/40 lg:bg-transparent rounded-xl border lg:border-0 border-base-300"
                    >
                      {/* Group Select */}
                      <div className="w-full lg:w-40">
                        <select
                          value={item.selectedGroup}
                          onChange={(e) =>
                            handleItemChange(idx, "selectedGroup", e.target.value)
                          }
                          className="select select-bordered select-sm w-full text-xs"
                        >
                          <option value="">Select Group...</option>
                          {availableGroups.map((grpName, gIdx) => (
                            <option key={gIdx} value={grpName}>
                              {grpName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sub-Group Select */}
                      <div className="w-full lg:w-40">
                        <select
                          value={item.selectedSubGroup}
                          onChange={(e) =>
                            handleItemChange(idx, "selectedSubGroup", e.target.value)
                          }
                          className="select select-bordered select-sm w-full text-xs"
                          disabled={!item.selectedGroup}
                        >
                          <option value="">Select Sub-Group...</option>
                          {availableSubGroups.map((sg, sgIdx) => {
                            const sgName = typeof sg === "object" ? (sg.name || sg.subGroupName) : sg;
                            return (
                              <option key={sgIdx} value={sgName}>
                                {sgName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Product Select */}
                      <div className="flex-1">
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            handleItemChange(idx, "productId", e.target.value)
                          }
                          className="select select-bordered select-sm w-full text-xs"
                        >
                          <option value="">Select Product...</option>
                          {filteredProducts.map((prod) => {
                            const pId = prod.productId || prod._id || prod.id;
                            const pName = prod.productName || prod.name;
                            return (
                              <option key={pId} value={pId}>
                                {pName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Current Stock */}
                      <div className="w-full lg:w-20 text-center">
                        <input
                          type="number"
                          value={item.currentStock}
                          readOnly
                          className="input input-bordered input-sm w-full text-center text-xs bg-base-200"
                        />
                      </div>

                      {/* In Transit */}
                      <div className="w-full lg:w-20 text-center">
                        <input
                          type="number"
                          value={item.transitStock}
                          readOnly
                          className="input input-bordered input-sm w-full text-center text-xs bg-base-200"
                        />
                      </div>

                      {/* Order Qty */}
                      <div className="w-full lg:w-20">
                        <input
                          type="number"
                          min="1"
                          value={item.orderQty}
                          onChange={(e) =>
                            handleItemChange(idx, "orderQty", e.target.value)
                          }
                          className="input input-bordered input-sm w-full text-center text-xs"
                        />
                      </div>

                      {/* Price */}
                      <div className="w-full lg:w-24">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(idx, "unitPrice", e.target.value)
                          }
                          className="input input-bordered input-sm w-full text-right text-xs"
                        />
                      </div>

                      {/* Weight */}
                      <div className="w-full lg:w-20">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitWeight}
                          onChange={(e) =>
                            handleItemChange(idx, "unitWeight", e.target.value)
                          }
                          className="input input-bordered input-sm w-full text-center text-xs"
                        />
                      </div>

                      {/* Unit Cost */}
                      <div className="w-full lg:w-28 text-right font-semibold text-xs py-1">
                        ৳ {(item.unitCostAfterCalc || 0).toFixed(2)}
                      </div>

                      {/* Total + Ship */}
                      <div className="w-full lg:w-28 text-right font-semibold text-xs py-1 text-teal-600">
                        ৳ {(item.totalWithShipping || 0).toFixed(2)}
                      </div>

                      {/* Remove Row */}
                      <div className="w-full lg:w-10 flex justify-end lg:justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                          disabled={items.length === 1}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expenses / Shipping Costs Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-base-200/50 p-4 rounded-xl border border-base-300">
                <div>
                  <label className="label py-1 text-xs font-semibold text-base-content/80">
                    Shipping Cost (৳)
                  </label>
                  <input
                    type="number"
                    name="shippingCost"
                    min="0"
                    step="0.01"
                    value={expenses.shippingCost}
                    onChange={handleExpenseChange}
                    className="input input-bordered input-sm w-full text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="label py-1 text-xs font-semibold text-base-content/80">
                    Transit Cost (৳)
                  </label>
                  <input
                    type="number"
                    name="transitCost"
                    min="0"
                    step="0.01"
                    value={expenses.transitCost}
                    onChange={handleExpenseChange}
                    className="input input-bordered input-sm w-full text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="label py-1 text-xs font-semibold text-base-content/80">
                    VAT Value
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      name="vatValue"
                      min="0"
                      step="0.01"
                      value={expenses.vatValue}
                      onChange={handleExpenseChange}
                      className="input input-bordered input-sm w-full text-xs font-medium"
                    />
                    <select
                      name="vatType"
                      value={expenses.vatType}
                      onChange={handleExpenseChange}
                      className="select select-bordered select-sm text-xs px-2"
                    >
                      <option value="percent">%</option>
                      <option value="flat">Flat</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label py-1 text-xs font-semibold text-base-content/80">
                    Other Cost (৳)
                  </label>
                  <input
                    type="number"
                    name="otherCost"
                    min="0"
                    step="0.01"
                    value={expenses.otherCost}
                    onChange={handleExpenseChange}
                    className="input input-bordered input-sm w-full text-xs font-medium"
                  />
                </div>
              </div>

              {/* Grand Total Summary Bar */}
              <div className="flex items-center justify-between bg-teal-50 border border-teal-200 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-teal-800 font-semibold text-sm">
                  <Calculator className="size-5" />
                  <span>Grand Total Amount:</span>
                </div>
                <div className="text-xl font-bold text-teal-700">
                  ৳ {calculations.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-sm btn-ghost px-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white px-6 border-0"
                >
                  {editData ? "Update Purchase Order" : "Save Purchase Order"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditPurchaseOrderModal;