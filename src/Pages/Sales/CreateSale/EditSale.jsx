// src/components/sale/EditSale.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { ShoppingCart, Box, History } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import SaleHeader from "./SaleHeader";
import SaleItemRow from "./SaleItemRow";
import SaleSummaryBar from "./SaleSummaryBar";
import SaleCalculation from "./SaleCalculation";
import { fetchSaleDependencies, updateSaleOrder } from "../../../services/saleOrderService/useSaleOrderServices";

const EditSale = ({ editData, onUpdateSuccess = () => {} }) => {
  const [states, setStates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsGroupSubgroup, setProductsGroupSubgroup] = useState([]);
  const [subgroupsList, setSubgroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const getTodayISO = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [orderDate, setOrderDate] = useState(getTodayISO());
  const dateInputRef = useRef(null);

  const initialRow = {
    selectedGroup: null,
    selectedSubGroup: null,
    productId: null,
    productName: "",
    currentStock: 0,
    orderQty: 0,
    unitPrice: 0,
    discountType: "percent",
    discountValue: 0,
  };

  const [items, setItems] = useState([initialRow]);
  
  const [globalDiscount, setGlobalDiscount] = useState({
    type: "percent",
    value: 0,
  });

  const [paidAmount, setPaidAmount] = useState(0);
  const [previousPaidTotal, setPreviousPaidTotal] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const initDataAndEditForm = async () => {
      try {
        setIsLoading(true);
        const data = await fetchSaleDependencies();

        const loadedStates = Array.isArray(data.states) ? data.states : [];
        const loadedCustomers = Array.isArray(data.customers) ? data.customers : [];
        const loadedProducts = Array.isArray(data.products) ? data.products : [];
        const loadedGroups = Array.isArray(data.productsGroupSubgroup) ? data.productsGroupSubgroup : [];
        const loadedSubgroups = Array.isArray(data.subgroups) ? data.subgroups : [];

        setStates(loadedStates);
        setCustomers(loadedCustomers);
        setProducts(loadedProducts);
        setProductsGroupSubgroup(loadedGroups);
        setSubgroupsList(loadedSubgroups);

        if (editData) {
          const regionStr = editData.customerState || editData.stateOrRegion || "";
          if (regionStr) {
            setSelectedState({ value: regionStr, label: regionStr });
          }
          
          const custIdVal = editData.customer?._id || editData.customer?.id || editData.customer;
          const foundCust = loadedCustomers.find(
            (c) => String(c._id) === String(custIdVal) || String(c.id) === String(custIdVal) || c.name === editData.customerName || c.customerName === editData.customerName
          );
          if (foundCust) {
            setSelectedCustomer({
              value: foundCust._id || foundCust.id,
              label: foundCust.customerName || foundCust.name,
            });
          }

          if (editData.orderDate) {
            const formattedDate = new Date(editData.orderDate).toISOString().split("T")[0];
            setOrderDate(formattedDate);
          }

          setGlobalDiscount({
            type: (editData.generalDiscountType === "%" || editData.generalDiscountType === "percent" || editData.generalDiscountType === "percentage") ? "percent" : "flat",
            value: editData.generalDiscountValue || 0,
          });

          let loadedPayments = [];
          if (Array.isArray(editData.payments) && editData.payments.length > 0) {
            loadedPayments = editData.payments;
          } else if (Array.isArray(editData.paymentHistory) && editData.paymentHistory.length > 0) {
            loadedPayments = editData.paymentHistory;
          } else if (editData.paidAmount > 0) {
            loadedPayments = [{ date: editData.orderDate || getTodayISO(), amount: editData.paidAmount }];
          }

          setPaymentHistory(loadedPayments);
          
          const totalPrevPaid = loadedPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
          setPreviousPaidTotal(totalPrevPaid);
          setPaidAmount(0);

          const itemsToMap = editData.soldItems || editData.products || [];
          if (Array.isArray(itemsToMap) && itemsToMap.length > 0) {
            const mappedRows = itemsToMap.map((item) => {
              const targetProdId = item.productId || item.product?._id || item.product;
              const matchedProd = loadedProducts.find(
                (p) => String(p._id) === String(targetProdId) || String(p.id) === String(targetProdId) || String(p.product) === String(targetProdId)
              );

              const unitP = item.unitPrice || item.price || matchedProd?.sellingPrice || 0;
              
              let discVal = 0;
              if (item.discountValue !== undefined && item.discountValue !== null) {
                discVal = Number(item.discountValue);
              } else if (item.discount !== undefined && item.discount !== null) {
                discVal = Number(item.discount);
              }

              let discType = "percent";
              if (item.discountType === "flat" || item.discountType === "৳" || item.discountType === "fixed") {
                discType = "flat";
              } else if (item.discountType === "percent" || item.discountType === "%" || item.discountType === "percentage") {
                discType = "percent";
              }

              const groupId = item.group?._id || item.group || matchedProd?.group?._id || matchedProd?.group || null;
              const subGroupId = item.subGroup?._id || item.subGroup || matchedProd?.subGroup?._id || matchedProd?.subGroup || null;

              return {
                selectedGroup: groupId,
                selectedSubGroup: subGroupId,
                productId: matchedProd ? { value: matchedProd._id || matchedProd.id, label: matchedProd.name || matchedProd.productName } : targetProdId,
                productName: item.productName || matchedProd?.name || item.product?.name || "",
                currentStock: matchedProd?.currentStock ?? 0,
                orderQty: item.orderQty || item.quantity || 0,
                unitPrice: unitP,
                discountType: discType,
                discountValue: discVal,
              };
            });
            setItems([...mappedRows, { ...initialRow }]);
          }
        }
      } catch (err) {
        console.error("Error loading edit dependency data:", err);
        toast.error("Failed to load dependency data for editing.");
      } finally {
        setIsLoading(false);
      }
    };

    initDataAndEditForm();
  }, [editData]);

  const availableGroups = useMemo(() => {
    if (!Array.isArray(productsGroupSubgroup)) return [];
    return productsGroupSubgroup
      .map((item) => {
        const name = item.groupName || item.name || item.group || item.title;
        const id = item._id || item.id || name;
        return name ? { value: id, label: name, rawName: name, ...item } : null;
      })
      .filter(Boolean);
  }, [productsGroupSubgroup]);

  const filteredCustomers = useMemo(() => {
    const currentState = selectedState?.value || selectedState;
    if (!currentState || currentState === "All") {
      return customers;
    }
    return customers.filter(
      (c) => c.state === currentState || c.customerState === currentState || c.division === currentState
    );
  }, [customers, selectedState]);

  const customerOptions = useMemo(() => {
    return Array.isArray(filteredCustomers)
      ? filteredCustomers.map((c) => ({
          value: c?._id || c?.id,
          label: c?.customerName || c?.name,
        }))
      : [];
  }, [filteredCustomers]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    const currentRow = { ...updatedItems[index] };

    if (field === "selectedGroup") {
      currentRow.selectedGroup = value;
      currentRow.selectedSubGroup = null;
      currentRow.productId = null;
      currentRow.productName = "";
      currentRow.currentStock = 0;
      currentRow.unitPrice = 0;
      currentRow.discountValue = 0;
    } else if (field === "selectedSubGroup") {
      currentRow.selectedSubGroup = value;
      currentRow.productId = null;
      currentRow.productName = "";
      currentRow.currentStock = 0;
      currentRow.unitPrice = 0;
      currentRow.discountValue = 0;
    } else if (field === "productId") {
      currentRow.productId = value;
      const targetId = value?.value || value;
      
      const selectedProd = products.find(
        (p) => 
          String(p._id) === String(targetId) || 
          String(p.id) === String(targetId) || 
          String(p.product) === String(targetId) || 
          String(p.product?._id) === String(targetId)
      );

      if (selectedProd) {
        currentRow.productName = selectedProd.name || selectedProd.productName || selectedProd.product?.name || "";
        currentRow.currentStock = selectedProd.currentStock ?? 0;
        currentRow.unitPrice = selectedProd.sellingPrice ?? selectedProd.unitPrice ?? selectedProd.price ?? 0;
        currentRow.selectedGroup = selectedProd.group?._id || selectedProd.group || currentRow.selectedGroup;
        currentRow.selectedSubGroup = selectedProd.subGroup?._id || selectedProd.subGroup || currentRow.selectedSubGroup;
      }
    } else if (["orderQty", "unitPrice", "discountValue"].includes(field)) {
      currentRow[field] = value === "" ? "" : Number(value);
    } else if (field === "discountType") {
      currentRow.discountType = (value === "flat" || value === "৳") ? "flat" : "percent";
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

  const calculations = useMemo(() => {
    const activeItems = items.filter((item) => item.productId !== null && item.productId !== "");

    const totalOrderQty = activeItems.reduce(
      (acc, item) => acc + (Number(item.orderQty) || 0),
      0
    );

    const calculatedItems = items.map((item) => {
      if (!item.productId) return item;

      const qty = Number(item.orderQty) || 0;
      const price = Number(item.unitPrice) || 0;
      const totalPrice = qty * price;

      let discountAmount = 0;
      const dVal = Number(item.discountValue) || 0;
      const dType = item.discountType === "flat" ? "flat" : "percent";

      if (dType === "percent") {
        discountAmount = (totalPrice * dVal) / 100;
      } else {
        discountAmount = dVal;
      }

      const afterDiscountPrice = Math.max(0, totalPrice - discountAmount);

      const targetId = typeof item.productId === "object" && item.productId !== null
        ? (item.productId.value || item.productId._id || item.productId.id)
        : item.productId;

      const matchedProd = products.find(
        (p) => 
          String(p._id) === String(targetId) || 
          String(p.id) === String(targetId) || 
          String(p.product) === String(targetId) || 
          String(p.product?._id) === String(targetId)
      );

      return {
        ...item,
        discountType: dType,
        discountValue: dVal,
        groupId: matchedProd?.group?._id || matchedProd?.group || (typeof item.selectedGroup === "object" ? item.selectedGroup?.value : item.selectedGroup),
        subGroupId: matchedProd?.subGroup?._id || matchedProd?.subGroup || (typeof item.selectedSubGroup === "object" ? item.selectedSubGroup?.value : item.selectedSubGroup),
        productObjId: matchedProd?.product?._id || matchedProd?.product || matchedProd?._id || targetId,
        currentStock: matchedProd?.currentStock ?? item.currentStock ?? 0,
        totalPrice,
        discountAmount,
        afterDiscountPrice,
      };
    });

    const rawSubtotal = calculatedItems
      .filter((item) => item.productId !== null && item.productId !== "")
      .reduce((acc, item) => acc + (item.afterDiscountPrice || 0), 0);

    const gVal = Number(globalDiscount.value) || 0;
    let globalDiscountAmount = 0;
    if (globalDiscount.type === "percent") {
      globalDiscountAmount = (rawSubtotal * gVal) / 100;
    } else {
      globalDiscountAmount = gVal;
    }

    const grandTotal = Math.max(0, rawSubtotal - globalDiscountAmount);
    
    const newPaidNum = Number(paidAmount) || 0;
    const totalPaidCalculated = previousPaidTotal + newPaidNum;

    const dueAmount = Math.max(0, grandTotal - totalPaidCalculated);

    return {
      totalOrderQty,
      calculatedItems,
      rawSubtotal,
      globalDiscountAmount,
      grandTotal,
      totalPaidCalculated,
      dueAmount,
    };
  }, [items, globalDiscount, paidAmount, previousPaidTotal, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validItems = calculations.calculatedItems.filter(
      (item) => item.productId !== null && item.productId !== "" && Number(item.orderQty) > 0
    );

    if (validItems.length === 0) {
      toast.error("Please select at least one product with valid quantity!", { autoClose: 2500 });
      return;
    }

    const customerId = selectedCustomer?.value || selectedCustomer;
    if (!customerId) {
      toast.error("Please select Customer!", { autoClose: 2500 });
      return;
    }

    const stateVal = selectedState ? (selectedState?.value || selectedState) : "";
    if (!stateVal || stateVal === "All") {
      toast.error("Please select a valid State / Region!", { autoClose: 2500 });
      return;
    }

    Swal.fire({
      title: "Update Sale Order?",
      text: "This will update the existing sales transaction.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Update Sale",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedPayments = Number(paidAmount) > 0 
            ? [...paymentHistory, { date: new Date(orderDate).toISOString(), amount: Number(paidAmount), paymentMethod: "Cash" }]
            : paymentHistory;

          const saleOrderPayload = {
            stateOrRegion: stateVal,
            customer: customerId,
            orderDate: new Date(orderDate).toISOString(),
            products: validItems.map((item) => ({
              state: stateVal,
              customer: customerId,
              group: item.groupId,
              subGroup: item.subGroupId,
              product: item.productObjId,
              quantity: Number(item.orderQty),
              unitPrice: Number(item.unitPrice),
              discountType: item.discountType === "flat" ? "fixed" : "percentage",
              discountValue: Number(item.discountValue || 0),
              discountAmount: Number(item.discountAmount || 0),
              totalPrice: Number(item.totalPrice || 0),
              afterDiscount: Number(item.afterDiscountPrice || 0),
            })),
            generalDiscountType: globalDiscount.type === "percent" ? "percentage" : "fixed",
            generalDiscountValue: Number(globalDiscount.value || 0),
            paidAmount: calculations.totalPaidCalculated,
            payments: updatedPayments.filter(p => p.amount > 0),
            status: editData?.status ? editData.status.toLowerCase() : "pending",
          };

          const orderIdToUpdate = editData.orderNo || editData._id;
          await updateSaleOrder(orderIdToUpdate, saleOrderPayload);

          toast.success("Sell order updated successfully!", { autoClose: 2000 });
          onUpdateSuccess();
        } catch (error) {
          console.error("Update error:", error);
          toast.error(error.message || "Failed to update sale order.");
        }
      }
    });
  };

  if (isLoading) return <div className="p-6">Loading edit form data...</div>;

  return (
    <div className="w-full min-h-screen px-4 md:px-8 py-6 bg-base-100 box-border">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-base-300">
        <ShoppingCart className="size-6 text-teal-600" />
        <h1 className="text-xl font-bold">Edit Sale Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SaleHeader
          states={states}
          customerOptions={customerOptions}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          orderDate={orderDate}
          setOrderDate={setOrderDate}
          convertToDDMMYYYY={(dateStr) => {
            if (!dateStr) return "";
            const parts = dateStr.split("-");
            return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
          }}
          dateInputRef={dateInputRef}
        />

        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
            <Box className="size-4" /> Product Selection & Pricing
          </h4>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-base-300/40 rounded-lg text-[11px] font-semibold text-base-content/70 text-center justify-end">
            <div className="flex-1 text-left">Group</div>
            <div className="flex-1 text-left">Sub-Group</div>
            <div className="flex-1 text-left">Product</div>
            <div className="w-16">Stock</div>
            <div className="w-16">Quantity</div>
            <div className="w-20">Price (৳)</div>
            <div className="w-32">Discount</div>
            <div className="w-20 text-right">Total Price</div>
            <div className="w-24 text-right">After Discount</div>
            <div className="w-8"></div>
          </div>

          {items.map((item, idx) => (
            <SaleItemRow
              key={idx}
              idx={idx}
              item={item}
              calcItem={calculations.calculatedItems[idx]}
              itemsLength={items.length}
              availableGroups={availableGroups}
              productsGroupSubgroup={subgroupsList}
              products={products}
              handleItemChange={handleItemChange}
              handleRemoveItemRow={handleRemoveItemRow}
            />
          ))}
        </div>

        <SaleSummaryBar
          totalOrderQty={calculations.totalOrderQty}
          rawSubtotal={calculations.rawSubtotal}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="w-full bg-base-100 rounded-2xl border border-base-300 p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-sm tracking-wide text-base-content flex items-center gap-2">
              GENERAL DISCOUNT & PAYMENTS
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-base-content/70 block mb-1">Discount Type & Value</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={globalDiscount.value}
                    onChange={(e) => setGlobalDiscount({ ...globalDiscount, value: e.target.value })}
                    className="input input-bordered input-sm w-full"
                  />
                  <select
                    value={globalDiscount.type}
                    onChange={(e) => setGlobalDiscount({ ...globalDiscount, type: e.target.value })}
                    className="select select-bordered select-sm w-20"
                  >
                    <option value="percent">%</option>
                    <option value="flat">৳</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-base-content/70 block mb-1">Paid Amount (৳)</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className="input input-bordered input-sm w-full"
                />
                {/* 5px niche previous paid value readonly akare show korbe */}
                <div className="mt-[5px] text-[11px] text-gray-500 font-medium">
                  Previous Paid: <span className="text-emerald-600 font-semibold">৳{previousPaidTotal}</span> (Total Paid so far: ৳{calculations.totalPaidCalculated})
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-base-100 rounded-2xl border border-base-300 p-5 shadow-sm space-y-2">
            <h4 className="font-bold text-sm tracking-wide text-base-content">GRAND ORDER CALCULATION</h4>
            <div className="text-xs space-y-1.5 text-base-content/80">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span>৳{calculations.rawSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-teal-700 font-medium border-b border-dashed pb-1">
                <span>• General Discount ({globalDiscount.value}{globalDiscount.type === "percent" ? "%" : "৳"}):</span>
                <span>- ৳{calculations.globalDiscountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1">
                <span>Grand Total:</span>
                <span className="text-blue-600">৳{calculations.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Paid Amount:</span>
                <span>৳{calculations.totalPaidCalculated.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Due Amount:</span>
                <span>৳{calculations.dueAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT HISTORY */}
        <div className="w-full bg-base-100 rounded-2xl border border-base-300 p-5 shadow-sm">
          <h4 className="font-bold text-sm tracking-wide text-base-content flex items-center gap-2 mb-3">
            <History className="size-4 text-teal-600" /> Payment History (Date & Amount)
          </h4>
          <div className="bg-base-200/50 border border-base-300 rounded-xl p-3 space-y-2 max-h-40 overflow-y-auto text-xs w-full">
            {paymentHistory.length === 0 ? (
              <div className="text-gray-400 text-center py-4">No previous payments recorded.</div>
            ) : (
              paymentHistory.map((pay, i) => (
                <div key={i} className="flex justify-between items-center text-gray-700 border-b border-base-300 pb-1.5 last:border-0">
                  <span className="font-medium">{pay.date ? new Date(pay.date).toLocaleDateString() : "N/A"}</span>
                  <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">৳{pay.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="submit"
            className="btn bg-teal-600 hover:bg-teal-700 text-white px-10"
          >
            Update Sale Order
          </button>
        </div>
      </form>
    </div>
  );
};

EditSale.displayName = "EditSale";
export default EditSale;