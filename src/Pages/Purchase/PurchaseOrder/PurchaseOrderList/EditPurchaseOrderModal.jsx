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
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const EditPurchaseOrderModal = ({
  isOpen,
  onClose,
  products = [],
  productsGroupSubgroup = [],
  onSaveStoreProduct,
  editData = null, // Added editData prop for editing mode
}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  // Helper to get today's date in YYYY-MM-DD for the HTML date input
  const getTodayISO = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helper to convert DD/MM/YYYY or other formats to YYYY-MM-DD for date inputs
  const parseDateToISO = (dateStr) => {
    if (!dateStr) return getTodayISO();
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    return dateStr;
  };

  const [orderDate, setOrderDate] = useState(getTodayISO());
  const [expectedReceiveDate, setExpectedReceiveDate] = useState("");
  const [orderStatus, setOrderStatus] = useState("Pending"); // New state for status

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

  // Pre-fill form when editData changes or modal opens
  useEffect(() => {
    if (editData) {
      setSelectedSupplier(editData.supplierName || "");
      setOrderDate(parseDateToISO(editData.orderDate));
      setExpectedReceiveDate(parseDateToISO(editData.expectedReceiveDate));
      setOrderStatus(editData.status || "Pending");

      if (editData.expenses) {
        setExpenses({
          shippingCost: editData.expenses.shippingCost || 0,
          vatValue: editData.expenses.vatValue || 0,
          vatType: editData.expenses.vatType || "percent",
          transitCost: editData.expenses.transitCost || 0,
          otherCost: editData.expenses.otherCost || 0,
        });
      }

      if (editData.purchasedItems && editData.purchasedItems.length > 0) {
        const mappedItems = editData.purchasedItems.map((item) => {
          // Try to match product group/subgroup from products list if missing
          const matchedProd = products.find(
            (p) => (p.productId || p._id) === (item.productId || item._id),
          );
          return {
            selectedGroup:
              item.selectedGroup ||
              matchedProd?.productGroup ||
              matchedProd?.group ||
              "",
            selectedSubGroup:
              item.selectedSubGroup ||
              matchedProd?.productSubGroup ||
              matchedProd?.subGroup ||
              "",
            productId: item.productId || item._id || "",
            productName:
              item.productName ||
              matchedProd?.productName ||
              matchedProd?.name ||
              "",
            currentStock: item.currentStock ?? 0,
            transitStock: item.transitStock ?? 0,
            orderQty: item.orderQty ?? 1,
            unitPrice: item.unitPrice ?? 0,
            unitWeight: item.unitWeight ?? 1,
          };
        });
        // Ensure there's an empty trailing row if desired, or keep exact items
        setItems([...mappedItems, { ...initialRow }]);
      }
    } else {
      // Reset to defaults for Create mode
      setItems([{ ...initialRow }]);
      setExpenses(initialExpenses);
      setSelectedSupplier("");
      setOrderDate(getTodayISO());
      setExpectedReceiveDate("");
      setOrderStatus("Pending");
    }
  }, [editData, isOpen, products]);

  // Fetch suppliers data from public/suppliersData.json
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
        toast.error("Could not load suppliers data for dropdown!");
      });
  }, []);

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
        (p) => p.productId === value || p._id === value,
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

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenses((prev) => ({
      ...prev,
      [name]: name === "vatType" ? value : value === "" ? "" : Number(value),
    }));
  };

  // Handler for Status Change with Toast Notification
  const handleStatusChange = (newStatus) => {
    setOrderStatus(newStatus);
    toast.info(`Status updated to: ${newStatus}`, { autoClose: 2000 });
  };

  // Function to convert YYYY-MM-DD into DD/MM/YYYY for final save/display
  const convertToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
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

    const actionText = editData
      ? "update this purchase order batch"
      : "create a new batch order with weight allocation";

    Swal.fire({
      title: editData ? "Update Purchase Order?" : "Confirm Purchase Order?",
      text: actionText,
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
        onSaveStoreProduct?.({
          ...(editData?.id ? { id: editData.id } : {}),
          ...(editData?._id ? { _id: editData._id } : {}),
          supplierName: selectedSupplier,
          orderDate: convertToDDMMYYYY(orderDate),
          expectedReceiveDate: convertToDDMMYYYY(expectedReceiveDate),
          status: orderStatus,
          purchasedItems: validItems,
          expenses: {
            ...expenses,
            vatAmount: calculations.calculatedVatAmount,
            shippingCostPerKg: calculations.shippingCostPerKg,
          },
          totals: {
            currentStock: calculations.totalCurrentStock,
            transitStock: calculations.totalTransitStock,
            orderQty: calculations.totalOrderQty,
            batchWeight: calculations.totalBatchWeight,
            rawSubtotal: calculations.rawSubtotal,
            totalItemsWithShipping: calculations.totalItemsWithShipping,
            grandTotal: calculations.grandTotal,
          },
          date: editData?.date || new Date().toISOString(),
        });

        toast.success(
          editData
            ? "Purchase order batch updated successfully!"
            : "Purchase order batch created successfully!",
          { autoClose: 2000 },
        );
        onClose();
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
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
            className="relative w-full max-w-[95vw] xl:max-w-7xl max-h-[92vh] bg-base-100 rounded-2xl shadow-2xl border border-base-300 z-10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-base-200 border-b border-base-300">
              <div className="flex items-center gap-3">
                <Store className="size-5 text-teal-600" />
                <h3 className="font-bold text-lg">
                  {editData
                    ? "Edit Batch Purchase Order"
                    : "Batch Purchase Order Entry"}
                </h3>
                {/* Status badge / quick switcher */}
                <div className="flex items-center gap-1.5 ml-4 bg-base-100 px-3 py-1 rounded-lg border border-base-300 text-xs">
                  <span className="font-semibold text-base-content/70">
                    Status:
                  </span>
                  <select
                    value={orderStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="select select-bordered select-xs font-bold text-teal-600 bg-base-200"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Transit">Transit</option>
                    <option value="Received">Received</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit}
              className="p-4 overflow-y-auto space-y-4 grow"
            >
              {/* Supplier & Dates Selection Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-base-200/50 p-3 rounded-xl border border-base-300">
                {/* Supplier Name Dropdown */}
                <div>
                  <label className="label py-0.5 text-xs font-semibold flex items-center gap-1.5 text-base-content/70">
                    <Building2 className="size-3.5 text-teal-600" /> Supplier
                    Name
                  </label>
                  <select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="select select-bordered select-xs w-full font-medium"
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

                {/* Order Date */}
                <div>
                  <label className="label py-0.5 text-xs font-semibold flex items-center gap-1.5 text-base-content/70">
                    <Calendar className="size-3.5 text-teal-600" /> Order Date{" "}
                    <span className="text-[10px] text-teal-600 font-bold">
                      ({convertToDDMMYYYY(orderDate) || "DD/MM/YYYY"})
                    </span>
                  </label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="input input-bordered input-xs w-full font-medium"
                    required
                  />
                </div>

                {/* Expected Receive Date */}
                <div>
                  <label className="label py-0.5 text-xs font-semibold flex items-center gap-1.5 text-base-content/70">
                    <Calendar className="size-3.5 text-teal-600" /> Expected
                    Receive Date{" "}
                    <span className="text-[10px] text-teal-600 font-bold">
                      (
                      {expectedReceiveDate
                        ? convertToDDMMYYYY(expectedReceiveDate)
                        : "DD/MM/YYYY"}
                      )
                    </span>
                  </label>
                  <input
                    type="date"
                    value={expectedReceiveDate}
                    onChange={(e) => setExpectedReceiveDate(e.target.value)}
                    className="input input-bordered input-xs w-full font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                    <Box className="size-4" /> Item Details
                  </h4>
                  <span className="text-xs text-base-content/60 font-medium">
                    Shipping Rate:{" "}
                    <b className="text-teal-600">
                      ৳ {calculations.shippingCostPerKg.toFixed(2)} / kg
                    </b>
                  </span>
                </div>

                {/* Table Header */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-base-300/40 rounded-lg text-[11px] font-semibold text-base-content/70 text-center">
                  <div className="w-32 text-left">Group</div>
                  <div className="w-32 text-left">Sub-Group</div>
                  <div className="flex-1 text-left">Product</div>
                  <div className="w-16">Cur. Stock</div>
                  <div className="w-16">In Transit</div>
                  <div className="w-16">Order Qty</div>
                  <div className="w-20">Price (৳)</div>
                  <div className="w-16">Wt (kg)</div>
                  <div className="w-24 text-right">Unit Cost</div>
                  <div className="w-24 text-right">Total + Ship</div>
                  <div className="w-8"></div>
                </div>

                {/* Rows */}
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

                  const calcItem = calculations.calculatedItems[idx];

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-wrap lg:flex-nowrap items-center gap-2 bg-base-200/50 p-2 rounded-xl border border-base-300 text-xs"
                    >
                      {/* Group */}
                      <div className="w-full sm:w-32">
                        <select
                          value={item.selectedGroup}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "selectedGroup",
                              e.target.value,
                            )
                          }
                          className="select select-bordered select-xs w-full"
                        >
                          <option value="">Group...</option>
                          {availableGroups.map((g, i) => (
                            <option key={i} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sub-Group */}
                      <div className="w-full sm:w-32">
                        <select
                          value={item.selectedSubGroup}
                          disabled={!item.selectedGroup}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "selectedSubGroup",
                              e.target.value,
                            )
                          }
                          className="select select-bordered select-xs w-full disabled:opacity-50"
                        >
                          <option value="">Sub-Group...</option>
                          {availableSubGroups.map((sg, i) => (
                            <option
                              key={i}
                              value={typeof sg === "string" ? sg : sg.name}
                            >
                              {typeof sg === "string" ? sg : sg.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product */}
                      <div className="flex-1 min-w-[150px]">
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            handleItemChange(idx, "productId", e.target.value)
                          }
                          className="select select-bordered select-xs w-full font-medium"
                        >
                          <option value="">Select Product...</option>
                          {filteredProducts.map((p) => {
                            const pId = p.productId || p._id;
                            const pName = p.productName || p.name;
                            return (
                              <option key={pId} value={pId}>
                                {pName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Current Stock */}
                      <div className="w-16 text-center">
                        <span className="badge badge-ghost badge-sm w-full font-medium text-[11px] py-1">
                          {item.currentStock}
                        </span>
                      </div>

                      {/* In Transit */}
                      <div className="w-16 text-center">
                        <span className="badge badge-warning/20 text-warning-content badge-sm w-full font-medium text-[11px] py-1">
                          {item.transitStock}
                        </span>
                      </div>

                      {/* Order Qty */}
                      <div className="w-16">
                        <input
                          type="number"
                          min="0"
                          value={item.orderQty}
                          onChange={(e) =>
                            handleItemChange(idx, "orderQty", e.target.value)
                          }
                          className="input input-bordered input-xs w-full text-center font-bold"
                        />
                      </div>

                      {/* Price */}
                      <div className="w-20">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(idx, "unitPrice", e.target.value)
                          }
                          className="input input-bordered input-xs w-full text-right"
                        />
                      </div>

                      {/* Weight */}
                      <div className="w-16">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitWeight}
                          onChange={(e) =>
                            handleItemChange(idx, "unitWeight", e.target.value)
                          }
                          className="input input-bordered input-xs w-full text-center"
                        />
                      </div>

                      {/* Unit Cost */}
                      <div className="w-24 text-right">
                        <span className="font-bold text-xs text-info block px-1">
                          ৳
                          {calcItem?.unitCostAfterCalc
                            ? calcItem.unitCostAfterCalc.toFixed(2)
                            : "0.00"}
                        </span>
                      </div>

                      {/* Total + Ship */}
                      <div className="w-24 text-right">
                        <span className="font-bold text-xs text-teal-600 block px-1">
                          ৳
                          {calcItem?.totalWithShipping
                            ? calcItem.totalWithShipping.toFixed(2)
                            : "0.00"}
                        </span>
                      </div>

                      {/* Delete */}
                      <div className="w-8 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          disabled={items.length === 1}
                          className="btn btn-square btn-ghost btn-xs text-error hover:bg-error/10 disabled:opacity-20"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Summary Bar */}
              <div className="bg-base-200 p-2.5 rounded-xl border border-base-300 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-base-content/60 block">
                    Cur. Stock
                  </span>
                  <span className="font-bold">
                    {calculations.totalCurrentStock}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-base-content/60 block">
                    In Transit
                  </span>
                  <span className="font-bold text-warning">
                    {calculations.totalTransitStock}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-base-content/60 block">
                    Order Qty
                  </span>
                  <span className="font-bold text-primary">
                    {calculations.totalOrderQty}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-base-content/60 block">
                    Total Weight
                  </span>
                  <span className="font-bold">
                    {calculations.totalBatchWeight.toFixed(2)} kg
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-semibold text-base-content/60 block">
                    Subtotal (W/ Ship & VAT)
                  </span>
                  <span className="font-bold text-teal-600">
                    ৳{" "}
                    {calculations.totalItemsWithShipping.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )}
                  </span>
                </div>
              </div>

              {/* Expenses Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-2 bg-base-200/40 p-3 rounded-xl border border-base-300">
                  <h5 className="font-bold text-xs uppercase text-base-content/70 flex items-center gap-1.5">
                    <Calculator className="size-4" /> Expenses Breakdown
                  </h5>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="label py-0.5 text-[11px] font-semibold">
                        Shipping Cost (৳)
                      </label>
                      <input
                        type="number"
                        name="shippingCost"
                        value={expenses.shippingCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </div>
                    <div>
                      <label className="label py-0.5 text-[11px] font-semibold">
                        Transit Cost (৳)
                      </label>
                      <input
                        type="number"
                        name="transitCost"
                        value={expenses.transitCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </div>

                    <div>
                      <label className="label py-0.5 text-[11px] font-semibold">
                        VAT {expenses.vatType === "percent" ? "(%)" : "(৳)"}
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          name="vatValue"
                          value={expenses.vatValue}
                          onChange={handleExpenseChange}
                          placeholder={
                            expenses.vatType === "percent" ? "%" : "৳"
                          }
                          className="input input-bordered input-xs w-full"
                        />
                        <select
                          name="vatType"
                          value={expenses.vatType}
                          onChange={handleExpenseChange}
                          className="select select-bordered select-xs font-bold text-primary"
                        >
                          <option value="percent">%</option>
                          <option value="amount">৳</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="label py-0.5 text-[11px] font-semibold">
                        Other Cost (৳)
                      </label>
                      <input
                        type="number"
                        name="otherCost"
                        value={expenses.otherCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-xs w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-base-200/70 p-3 rounded-xl border border-base-300 flex flex-col justify-between space-y-1">
                  <h5 className="font-bold text-xs uppercase text-base-content/70">
                    Grand Order Calculation
                  </h5>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-base-content/70">
                      <span>Base Subtotal:</span>
                      <span className="font-semibold">
                        ৳ {calculations.rawSubtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-base-content/60 text-[11px] pl-2 border-l-2 border-teal-500/40">
                      <span>
                        • Shipping ({calculations.totalBatchWeight.toFixed(2)}{" "}
                        kg @ ৳{calculations.shippingCostPerKg.toFixed(2)}/kg):
                      </span>
                      <span>
                        ৳{" "}
                        {(Number(expenses.shippingCost) || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-base-content/60 text-[11px] pl-2 border-l-2 border-teal-500/40">
                      <span>
                        • VAT (
                        {expenses.vatType === "percent"
                          ? `${expenses.vatValue || 0}%`
                          : "Fixed"}
                        ):
                      </span>
                      <span>
                        ৳ {calculations.calculatedVatAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-base-content/60 text-[11px] pl-2 border-l-2 border-teal-500/40">
                      <span>• Transit Cost:</span>
                      <span>
                        ৳ {(Number(expenses.transitCost) || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-base-content/60 text-[11px] pl-2 border-l-2 border-teal-500/40">
                      <span>• Other Expenses:</span>
                      <span>
                        ৳ {(Number(expenses.otherCost) || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="divider my-1"></div>

                    <div className="flex justify-between font-bold text-teal-600 text-sm">
                      <span>Grand Total:</span>
                      <span>
                        ৳{" "}
                        {calculations.grandTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="card-actions justify-end pt-2">
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary w-full text-white bg-teal-600 hover:bg-teal-700 border-0"
                    >
                      {editData
                        ? "Update Purchase Order"
                        : "Save Purchase Order"}
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

export default EditPurchaseOrderModal;
