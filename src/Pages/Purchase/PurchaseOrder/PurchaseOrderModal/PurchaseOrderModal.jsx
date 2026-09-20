import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Store, Calculator, Box, Calendar, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Select from "react-select"; // Searchable dropdown-er jonno react-select import kora holo

const StoreProductModal = ({
  isOpen,
  onClose,
  products = [],
  productsGroupSubgroup = [],
  onSaveStoreProduct,
}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  
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
        toast.error("Could not load suppliers data for dropdown!");
      });
  }, []);

  const initialRow = {
    selectedGroup: null,
    selectedSubGroup: null,
    productId: null,
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

  const availableGroups = useMemo(() => {
    if (!Array.isArray(productsGroupSubgroup)) return [];
    return productsGroupSubgroup
      .map((item) => {
        const name = item.group || item.groupName || item.name;
        return name ? { value: name, label: name } : null;
      })
      .filter(Boolean);
  }, [productsGroupSubgroup]);

  const supplierOptions = useMemo(() => {
    return suppliers.map((sup) => ({
      value: sup.supplierName,
      label: sup.supplierName,
    }));
  }, [suppliers]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    const currentRow = { ...updatedItems[index] };

    if (field === "selectedGroup") {
      currentRow.selectedGroup = value;
      currentRow.selectedSubGroup = null;
      currentRow.productId = null;
      currentRow.productName = "";
      currentRow.currentStock = 0;
      currentRow.transitStock = 0;
      currentRow.unitPrice = 0;
    } else if (field === "selectedSubGroup") {
      currentRow.selectedSubGroup = value;
      currentRow.productId = null;
      currentRow.productName = "";
      currentRow.currentStock = 0;
      currentRow.transitStock = 0;
      currentRow.unitPrice = 0;
    } else if (field === "productId") {
      currentRow.productId = value;
      const selectedProd = products.find(
        (p) => (p.productId || p._id) === value?.value,
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

    if (field === "productId" && value !== null && index === items.length - 1) {
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

  const convertToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  const calculations = useMemo(() => {
    const activeItems = items.filter((item) => item.productId !== null);

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
        productId: item.productId?.value || item.productId,
        selectedGroup: item.selectedGroup?.value || item.selectedGroup,
        selectedSubGroup: item.selectedSubGroup?.value || item.selectedSubGroup,
        lineWeight,
        allocatedShipping,
        allocatedVat,
        rawLinePrice,
        totalWithShipping: totalWithShippingAndVat,
        unitCostAfterCalc,
      };
    });

    const totalItemsWithShipping = calculatedItems
      .filter((item) => item.productId !== null)
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
      (item) => item.productId !== null,
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
      text: "This will create a new batch order with weight allocation.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Confirm Batch",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        onSaveStoreProduct?.({
          supplierName: selectedSupplier.value,
          orderDate: convertToDDMMYYYY(orderDate),
          expectedReceiveDate: convertToDDMMYYYY(expectedReceiveDate),
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
          date: new Date().toISOString(),
        });

        toast.success("Purchase order batch created successfully!", {
          autoClose: 2000,
        });
        setItems([{ ...initialRow }]);
        setExpenses(initialExpenses);
        setSelectedSupplier(null);
        setExpectedReceiveDate("");
        onClose();
      }
    });
  };

  // Custom styles for react-select to match DaisyUI / Tailwind inputs and bigger fonts
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "32px",
      fontSize: "14px",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#0d9488" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #0d9488" : "none",
      "&:hover": { borderColor: "#0d9488" },
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px",
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      backgroundColor: state.isSelected ? "#0d9488" : state.isFocused ? "#f3f4f6" : "white",
      color: state.isSelected ? "white" : "#374151",
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[10px] sm:px-[20px]">
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
            className="relative w-full h-[calc(100vh-20px)] max-w-[calc(100vw-40px)] bg-base-100 rounded-2xl shadow-2xl border border-base-300 z-10 flex flex-col overflow-hidden text-sm sm:text-base"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-base-200 border-b border-base-300">
              <div className="flex items-center gap-2">
                <Store className="size-6 text-teal-600" />
                <h3 className="font-bold text-xl">
                  Batch Purchase Order Entry
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
              className="p-6 overflow-y-auto space-y-6 grow"
            >
              {/* Supplier & Dates Selection Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-base-200/50 p-4 rounded-xl border border-base-300">
                <div>
                  <label className="label py-1 text-sm font-bold flex items-center gap-1.5 text-base-content/80">
                    <Building2 className="size-4 text-teal-600" /> Supplier Name
                  </label>
                  <Select
                    value={selectedSupplier}
                    onChange={setSelectedSupplier}
                    options={supplierOptions}
                    placeholder="Search or Select Supplier..."
                    styles={customSelectStyles}
                    isSearchable
                    required
                  />
                </div>

                <div>
                  <label className="label py-1 text-sm font-bold flex items-center gap-1.5 text-base-content/80">
                    <Calendar className="size-4 text-teal-600" /> Order Date <span className="text-xs text-teal-600 font-bold">({convertToDDMMYYYY(orderDate) || "DD/MM/YYYY"})</span>
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
                  <label className="label py-1 text-sm font-bold flex items-center gap-1.5 text-base-content/80">
                    <Calendar className="size-4 text-teal-600" /> Expected Receive Date <span className="text-xs text-teal-600 font-bold">({expectedReceiveDate ? convertToDDMMYYYY(expectedReceiveDate) : "DD/MM/YYYY"})</span>
                  </label>
                  <input
                    type="date"
                    value={expectedReceiveDate}
                    onChange={(e) => setExpectedReceiveDate(e.target.value)}
                    className="input input-bordered input-sm w-full font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                    <Box className="size-5" /> Item Details
                  </h4>
                  <span className="text-sm text-base-content/70 font-medium">
                    Shipping Rate:{" "}
                    <b className="text-teal-600">
                      ৳ {calculations.shippingCostPerKg.toFixed(2)} / kg
                    </b>
                  </span>
                </div>

                {/* Rows */}
                {items.map((item, idx) => {
                  const matchedGroupObj = Array.isArray(productsGroupSubgroup)
                    ? productsGroupSubgroup.find(
                        (g) =>
                          (g.group || g.groupName || g.name) ===
                          item.selectedGroup?.value,
                      )
                    : null;

                  const availableSubGroups = matchedGroupObj
                    ? (matchedGroupObj.subGroup || matchedGroupObj.subGroups || []).map(sg => ({
                        value: typeof sg === "string" ? sg : sg.name,
                        label: typeof sg === "string" ? sg : sg.name,
                      }))
                    : [];

                  const filteredProducts = products.filter((p) => {
                    const matchGroup =
                      !item.selectedGroup ||
                      p.productGroup === item.selectedGroup?.value ||
                      p.group === item.selectedGroup?.value;

                    const matchSubGroup =
                      !item.selectedSubGroup ||
                      p.productSubGroup === item.selectedSubGroup?.value ||
                      p.subGroup === item.selectedSubGroup?.value;

                    return matchGroup && matchSubGroup;
                  }).map(p => ({
                    value: p.productId || p._id,
                    label: p.productName || p.name,
                  }));

                  const calcItem = calculations.calculatedItems[idx];

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-wrap lg:flex-nowrap items-center gap-3 bg-base-200/50 p-3 rounded-xl border border-base-300 text-sm"
                    >
                      {/* Group */}
                      <div className="w-full sm:w-48">
                        <Select
                          value={item.selectedGroup}
                          onChange={(val) => handleItemChange(idx, "selectedGroup", val)}
                          options={availableGroups}
                          placeholder="Group..."
                          styles={customSelectStyles}
                          isClearable
                          isSearchable
                        />
                      </div>

                      {/* Sub-Group */}
                      <div className="w-full sm:w-48">
                        <Select
                          value={item.selectedSubGroup}
                          onChange={(val) => handleItemChange(idx, "selectedSubGroup", val)}
                          options={availableSubGroups}
                          placeholder="Sub-Group..."
                          isDisabled={!item.selectedGroup}
                          styles={customSelectStyles}
                          isClearable
                          isSearchable
                        />
                      </div>

                      {/* Product */}
                      <div className="flex-1 min-w-[200px]">
                        <Select
                          value={item.productId}
                          onChange={(val) => handleItemChange(idx, "productId", val)}
                          options={filteredProducts}
                          placeholder="Select Product..."
                          styles={customSelectStyles}
                          isSearchable
                        />
                      </div>

                      {/* Current Stock */}
                      <div className="w-20 text-center">
                        <span className="badge badge-ghost badge-lg w-full font-bold text-xs py-2">
                          {item.currentStock}
                        </span>
                      </div>

                      {/* In Transit */}
                      <div className="w-20 text-center">
                        <span className="badge badge-warning/20 text-warning-content badge-lg w-full font-bold text-xs py-2">
                          {item.transitStock}
                        </span>
                      </div>

                      {/* Order Qty */}
                      <div className="w-20">
                        <input
                          type="number"
                          min="0"
                          value={item.orderQty}
                          onChange={(e) =>
                            handleItemChange(idx, "orderQty", e.target.value)
                          }
                          className="input input-bordered input-sm w-full text-center font-bold text-base"
                        />
                      </div>

                      {/* Price */}
                      <div className="w-24">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(idx, "unitPrice", e.target.value)
                          }
                          className="input input-bordered input-sm w-full text-right text-base"
                        />
                      </div>

                      {/* Weight */}
                      <div className="w-20">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitWeight}
                          onChange={(e) =>
                            handleItemChange(idx, "unitWeight", e.target.value)
                          }
                          className="input input-bordered input-sm w-full text-center text-base"
                        />
                      </div>

                      {/* Unit Cost */}
                      <div className="w-28 text-right">
                        <span className="font-bold text-sm text-info block px-1">
                          ৳
                          {calcItem?.unitCostAfterCalc
                            ? calcItem.unitCostAfterCalc.toFixed(2)
                            : "0.00"}
                        </span>
                      </div>

                      {/* Total + Ship */}
                      <div className="w-28 text-right">
                        <span className="font-bold text-sm text-teal-600 block px-1">
                          ৳
                          {calcItem?.totalWithShipping
                            ? calcItem.totalWithShipping.toFixed(2)
                            : "0.00"}
                        </span>
                      </div>

                      {/* Delete */}
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

              {/* Summary Bar */}
              <div className="bg-base-200 p-4 rounded-xl border border-base-300 grid grid-cols-2 sm:grid-cols-5 gap-4 text-center text-sm">
                <div>
                  <span className="text-xs uppercase font-bold text-base-content/70 block">
                    Cur. Stock
                  </span>
                  <span className="font-bold text-base">
                    {calculations.totalCurrentStock}
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-base-content/70 block">
                    In Transit
                  </span>
                  <span className="font-bold text-warning text-base">
                    {calculations.totalTransitStock}
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-base-content/70 block">
                    Order Qty
                  </span>
                  <span className="font-bold text-primary text-base">
                    {calculations.totalOrderQty}
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-base-content/70 block">
                    Total Weight
                  </span>
                  <span className="font-bold text-base">
                    {calculations.totalBatchWeight.toFixed(2)} kg
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-xs uppercase font-bold text-base-content/70 block">
                    Subtotal (W/ Ship & VAT)
                  </span>
                  <span className="font-bold text-teal-600 text-base">
                    ৳{" "}
                    {calculations.totalItemsWithShipping.toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )}
                  </span>
                </div>
              </div>

              {/* Expenses Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3 bg-base-200/40 p-4 rounded-xl border border-base-300">
                  <h5 className="font-bold text-sm uppercase text-base-content/80 flex items-center gap-1.5">
                    <Calculator className="size-5" /> Expenses Breakdown
                  </h5>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="label py-1 text-xs font-bold">
                        Shipping Cost (৳)
                      </label>
                      <input
                        type="number"
                        name="shippingCost"
                        value={expenses.shippingCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full text-base"
                      />
                    </div>
                    <div>
                      <label className="label py-1 text-xs font-bold">
                        Transit Cost (৳)
                      </label>
                      <input
                        type="number"
                        name="transitCost"
                        value={expenses.transitCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full text-base"
                      />
                    </div>

                    <div>
                      <label className="label py-1 text-xs font-bold">
                        VAT {expenses.vatType === "percent" ? "(%)" : "(৳)"}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          name="vatValue"
                          value={expenses.vatValue}
                          onChange={handleExpenseChange}
                          placeholder={
                            expenses.vatType === "percent" ? "%" : "৳"
                          }
                          className="input input-bordered input-sm w-full text-base"
                        />
                        <select
                          name="vatType"
                          value={expenses.vatType}
                          onChange={handleExpenseChange}
                          className="select select-bordered select-sm font-bold text-primary text-base"
                        >
                          <option value="percent">%</option>
                          <option value="amount">৳</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="label py-1 text-xs font-bold">
                        Other Cost (৳)
                      </label>
                      <input
                        type="number"
                        name="otherCost"
                        value={expenses.otherCost}
                        onChange={handleExpenseChange}
                        className="input input-bordered input-sm w-full text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-base-200/70 p-4 rounded-xl border border-base-300 flex flex-col justify-between space-y-2">
                  <h5 className="font-bold text-sm uppercase text-base-content/80">
                    Grand Order Calculation
                  </h5>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-base-content/80 font-medium">
                      <span>Base Subtotal:</span>
                      <span className="font-bold text-base">
                        ৳ {calculations.rawSubtotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-base-content/70 text-xs pl-2 border-l-2 border-teal-500/40">
                      <span>
                        • Shipping ({calculations.totalBatchWeight.toFixed(2)}{" "}
                        kg @ ৳{calculations.shippingCostPerKg.toFixed(2)}/kg):
                      </span>
                      <span>
                        ৳{" "}
                        {(Number(expenses.shippingCost) || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-base-content/70 text-xs pl-2 border-l-2 border-teal-500/40">
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
                    <div className="flex justify-between text-base-content/70 text-xs pl-2 border-l-2 border-teal-500/40">
                      <span>• Transit Cost:</span>
                      <span>
                        ৳ {(Number(expenses.transitCost) || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-base-content/70 text-xs pl-2 border-l-2 border-teal-500/40">
                      <span>• Other Expenses:</span>
                      <span>
                        ৳ {(Number(expenses.otherCost) || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="divider my-1"></div>
                    <div className="flex justify-between font-bold text-lg text-teal-600">
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
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost px-6 text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-teal-600 hover:bg-teal-700 text-white px-8 text-base border-0"
                >
                  Confirm Purchase Order
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