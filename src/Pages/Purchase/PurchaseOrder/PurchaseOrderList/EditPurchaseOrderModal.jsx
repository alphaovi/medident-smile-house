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
  suppliers = [],
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [subGroups, setSubGroups] = useState([]);
  const [inventories, setInventories] = useState([]);

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

    const fetchExtraData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "https://alphaovi-medident-backend.vercel.app/api/v1";
        const [subRes, invRes] = await Promise.all([
          fetch(`${baseUrl}/product-subgroups`),
          fetch(`${baseUrl}/inventory`)
        ]);
        
        const subData = subRes.ok ? await subRes.json() : [];
        setSubGroups(Array.isArray(subData) ? subData : (subData?.data || subData?.result || []));

        const invData = invRes.ok ? await invRes.json() : [];
        setInventories(Array.isArray(invData) ? invData : (invData?.data || invData?.result || []));
      } catch (err) {
        console.error("Error fetching extra data:", err);
      }
    };

    fetchExtraData();
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

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenses((prev) => ({
      ...prev,
      [name]: name === "vatInput" ? value : (value === "" ? "" : Number(value)),
    }));
  };

  useEffect(() => {
    if (editData && isOpen) {
      const rawSupRef = editData.supplierName || editData.supplier;
      let resolvedSupplierVal = "";
      if (typeof rawSupRef === "object" && rawSupRef !== null) {
        resolvedSupplierVal = rawSupRef._id || rawSupRef.supplierId || rawSupRef.supplierName || "";
      } else {
        resolvedSupplierVal = rawSupRef || "";
      }

      const foundSup = suppliers.find(
        (s) =>
          String(s._id) === String(resolvedSupplierVal) ||
          String(s.supplierId) === String(resolvedSupplierVal) ||
          String(s.supplierName || s.name || "").trim().toLowerCase() === String(resolvedSupplierVal || "").trim().toLowerCase()
      );
      setSelectedSupplier(foundSup ? (foundSup._id || foundSup.supplierId) : resolvedSupplierVal);

      if (editData.orderDate || editData.purchaseDate) {
        const oDate = editData.purchaseDate || editData.orderDate;
        const dateStr = typeof oDate === "string" ? oDate : new Date(oDate).toISOString();
        setOrderDate(dateStr.split("T")[0]);
      }

      const expDate = editData.expectedReceiveDate || editData.expectedDate || editData.expectedDeliveryDate;
      if (expDate) {
        const dateStr = typeof expDate === "string" ? expDate : new Date(expDate).toISOString();
        setExpectedReceiveDate(dateStr.split("T")[0]);
      }

      const extShipping = editData.shippingCost ?? editData.shipping ?? editData.expenses?.shippingCost ?? editData.expenses?.shipping ?? 0;
      const extTransit = editData.transitCost ?? editData.transit ?? editData.expenses?.transitCost ?? editData.expenses?.transit ?? 0;
      const extVatVal = editData.vatValue ?? editData.vatAmount ?? editData.vat ?? editData.expenses?.vatValue ?? editData.expenses?.vat ?? 0;
      const extOther = editData.otherCost ?? editData.other ?? editData.expenses?.otherCost ?? editData.expenses?.other ?? 0;
      
      const rawVatType = editData.vatType ?? editData.expenses?.vatType ?? "%";
      const normalizedVatInput = rawVatType === "%" ? `${extVatVal}%` : `${extVatVal}`;

      setExpenses({
        shippingCost: Number(extShipping),
        transitCost: Number(extTransit),
        vatInput: normalizedVatInput,
        otherCost: Number(extOther),
      });

      const rawItems = editData.items || editData.purchasedItems || editData.products || [];
      if (rawItems.length > 0) {
        const mappedItems = rawItems.map((item) => {
          const rawProdRef = item.product || item.productId || item._id;
          let prodId = "";
          let prodName = "";
          
          if (typeof rawProdRef === "object" && rawProdRef !== null) {
            prodId = rawProdRef._id || rawProdRef.productId || rawProdRef.id || "";
            prodName = rawProdRef.productName || rawProdRef.name || "";
          } else {
            prodId = rawProdRef || "";
          }

          const prodMatch = products.find(
            (p) =>
              String(p._id || p.productId || p.id) === String(prodId) ||
              String(p.productName || p.name || "").trim().toLowerCase() === String(prodName || item.productName || "").trim().toLowerCase()
          );

          const finalProdId = prodMatch ? (prodMatch._id || prodMatch.productId || prodMatch.id) : prodId;
          const finalProdName = prodName || item.productName || prodMatch?.productName || prodMatch?.name || "";

          const matchedInventory = inventories.find(
            (inv) => String(inv.product?._id || inv.product) === String(finalProdId)
          );

          const rawGroupRef = item.group || item.selectedGroup || prodMatch?.productGroup || prodMatch?.group || "";
          let groupVal = typeof rawGroupRef === "object" && rawGroupRef !== null ? (rawGroupRef._id || rawGroupRef.id || rawGroupRef.group || "") : rawGroupRef;
          
          const groupMatch = productsGroupSubgroup.find(
            (g) =>
              String(g._id || g.id) === String(groupVal) ||
              String(g.group || g.groupName || g.name || "").trim().toLowerCase() === String(groupVal || "").trim().toLowerCase()
          );
          const resolvedGroupId = groupMatch ? (groupMatch._id || groupMatch.id) : groupVal;

          const rawSubGroupRef = item.subGroup || item.selectedSubGroup || prodMatch?.productSubGroup || prodMatch?.subGroup || "";
          let subGroupVal = typeof rawSubGroupRef === "object" && rawSubGroupRef !== null ? (rawSubGroupRef._id || rawSubGroupRef.id || rawSubGroupRef.name || "") : rawSubGroupRef;

          const subGroupMatch = subGroups.find(
            (sg) =>
              String(sg._id || sg.id) === String(subGroupVal) ||
              String(sg.subGroupName || sg.name || "").trim().toLowerCase() === String(subGroupVal || "").trim().toLowerCase()
          );
          const resolvedSubGroupId = subGroupMatch ? (subGroupMatch._id || subGroupMatch.id) : subGroupVal;

          return {
            selectedGroup: resolvedGroupId || "",
            selectedSubGroup: resolvedSubGroupId || "",
            productId: finalProdId || "",
            productName: finalProdName,
            currentStock: matchedInventory?.currentStock ?? item.currentStock ?? prodMatch?.quantity ?? prodMatch?.currentStock ?? 0,
            transitStock: matchedInventory?.onTransit ?? item.inTransit ?? item.transitStock ?? prodMatch?.inTransit ?? prodMatch?.transitStock ?? 0,
            orderQty: item.orderQuantity ?? item.orderQty ?? item.quantity ?? 1,
            unitPrice: item.price ?? item.unitPrice ?? prodMatch?.purchasePrice ?? prodMatch?.unitPrice ?? 0,
            unitWeight: item.weight ?? item.unitWeight ?? prodMatch?.unitWeight ?? prodMatch?.weight ?? 1,
          };
        });
        mappedItems.push({ ...initialRow });
        setItems(mappedItems);
      }
    } else if (!editData && isOpen) {
      setItems([{ ...initialRow }]);
      setExpenses(initialExpenses);
      setSelectedSupplier("");
      setOrderDate(getTodayISO());
      setExpectedReceiveDate("");
    }
  }, [isOpen, editData?._id, subGroups, inventories]);

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
      const unitCostAfterCalc = qty > 0 ? totalWithShippingAndVat / qty : uPrice;

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
      heightAuto: false,
      customClass: {
        container: "z-[99999]",
        popup: "rounded-2xl p-6 shadow-2xl border border-base-200",
        confirmButton: "btn btn-sm text-white px-4 border-0 bg-teal-600 hover:bg-teal-700",
        cancelButton: "btn btn-sm btn-ghost px-4",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const payloadData = {
          ...(editData || {}),
          supplierName: selectedSupplier,
          purchaseDate: orderDate ? new Date(orderDate).toISOString() : new Date().toISOString(),
          expectedDeliveryDate: expectedReceiveDate ? new Date(expectedReceiveDate).toISOString() : new Date().toISOString(),
          shippingCost: Number(expenses.shippingCost) || 0,
          transitCost: Number(expenses.transitCost) || 0,
          vatType: calculations.isPercent ? "%" : "flat",
          vatValue: calculations.vatValNum,
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
            transitCost: Number(item.allocatedTransit) || 0,
            otherCost: Number(item.allocatedOther) || 0,
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
            className="relative w-full h-[90vh] max-w-6xl bg-base-100 rounded-2xl shadow-2xl border border-base-300 z-10 flex flex-col overflow-hidden text-sm"
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
                    {suppliers.map((sup) => {
                      const supId = sup._id || sup.supplierId;
                      const supName = sup.supplierName || sup.name;
                      return (
                        <option key={supId} value={supId}>
                          {supName}
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
                  <div className="w-32 text-left">Group</div>
                  <div className="w-32 text-left">Sub-Group</div>
                  <div className="flex-1 min-w-[220px] text-left">Product</div>
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
                  const calcItem = calculations.calculatedItems[idx] || item;

                  const availableSubGroups = subGroups.filter((sg) => {
                    const parentGroupId = sg.group?._id || sg.group;
                    return String(parentGroupId) === String(item.selectedGroup);
                  });

                  const filteredProducts = products.filter((p) => {
                    const pGroup = p.group?._id || p.group || p.productGroup;
                    const pSubGroup = p.subGroup?._id || p.subGroup || p.productSubGroup;

                    const matchGroup =
                      !item.selectedGroup ||
                      String(pGroup) === String(item.selectedGroup) ||
                      String(p.productGroup || "").trim().toLowerCase() === String(item.selectedGroup || "").trim().toLowerCase();

                    const matchSubGroup =
                      !item.selectedSubGroup ||
                      String(pSubGroup) === String(item.selectedSubGroup) ||
                      String(p.productSubGroup || "").trim().toLowerCase() === String(item.selectedSubGroup || "").trim().toLowerCase();

                    return matchGroup && matchSubGroup;
                  });

                  return (
                    <div
                      key={idx}
                      className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 p-3 lg:p-0 bg-base-200/40 lg:bg-transparent rounded-xl border lg:border-0 border-base-300"
                    >
                      {/* Group Select */}
                      <div className="w-full lg:w-32">
                        <select
                          value={item.selectedGroup}
                          onChange={(e) =>
                            handleItemChange(idx, "selectedGroup", e.target.value)
                          }
                          className="select select-bordered select-sm w-full text-xs"
                        >
                          <option value="">Select Group...</option>
                          {productsGroupSubgroup.map((grp) => {
                            const gId = grp._id || grp.id;
                            const gName = grp.group || grp.groupName || grp.name;
                            return (
                              <option key={gId} value={gId}>
                                {gName}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Sub-Group Select */}
                      <div className="w-full lg:w-32">
                        <select
                          value={item.selectedSubGroup}
                          onChange={(e) =>
                            handleItemChange(idx, "selectedSubGroup", e.target.value)
                          }
                          className="select select-bordered select-sm w-full text-xs"
                          disabled={!item.selectedGroup}
                        >
                          <option value="">Select Sub-Group...</option>
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

                      {/* Product Select */}
                      <div className="flex-1 min-w-[220px]">
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            handleItemChange(idx, "productId", e.target.value)
                          }
                          className="select select-bordered select-sm w-full text-xs"
                        >
                          <option value="">Select Product...</option>
                          {filteredProducts.map((prod) => {
                            const pId = prod._id || prod.productId || prod.id;
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
                        ৳ {(calcItem.unitCostAfterCalc || item.unitPrice || 0).toFixed(2)}
                      </div>

                      {/* Total + Ship */}
                      <div className="w-full lg:w-28 text-right font-semibold text-xs py-1 text-teal-600">
                        ৳ {(calcItem.totalWithShipping || (item.orderQty * item.unitPrice) || 0).toFixed(2)}
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
                    VAT (e.g. 5% or 50)
                  </label>
                  <input
                    type="text"
                    name="vatInput"
                    placeholder="e.g. 5% or 50"
                    value={expenses.vatInput}
                    onChange={handleExpenseChange}
                    className="input input-bordered input-sm w-full text-xs font-medium"
                  />
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