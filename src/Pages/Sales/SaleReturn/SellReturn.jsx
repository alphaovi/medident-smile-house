// src/Pages/Sales/SaleReturn/SellReturn.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { RotateCcw, Box, History } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import SaleHeader from "../CreateSale/SaleHeader";
import SaleItemRow from "../CreateSale/SaleItemRow";
import SaleSummaryBar from "../CreateSale/SaleSummaryBar";
import SaleCalculation from "../CreateSale/SaleCalculation";
import SingleSellReturn from "./SingleSellReturn";

import { fetchSaleDependencies } from "../../../services/saleOrderService/useSaleOrderServices";
import { useSellReturnServices } from "../../../services/sellReturnSerives/useSellReturnServices";

const SellReturn = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [editingId, setEditingId] = useState(null);
  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [states, setStates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsGroupSubgroup, setProductsGroupSubgroup] = useState([]);
  const [subgroupsList, setSubgroupsList] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const getTodayISO = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [returnDate, setReturnDate] = useState(getTodayISO());
  const dateInputRef = useRef(null);

  const initialRow = {
    selectedGroup: null,
    selectedSubGroup: null,
    productId: null,
    productName: "",
    currentStock: 0,
    orderQty: 0,
    unitPrice: 0,
    discountType: "flat",
    discountValue: 0,
  };

  const [items, setItems] = useState([initialRow]);
  const [globalDiscount, setGlobalDiscount] = useState({ type: "flat", value: 0 });
  
  const [paidAmount, setPaidAmount] = useState(0);
  const [previousPaidTotal, setPreviousPaidTotal] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    fetchReturns();
    fetchDependencies();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const res = await useSellReturnServices.getAllSellReturns();
      const list = Array.isArray(res) ? res : res?.data || [];

      const formatted = list.map((item) => {
        const paymentsArr = Array.isArray(item.payments) ? item.payments : [];
        const totalPaid = paymentsArr.reduce((acc, p) => acc + Number(p.amount || 0), 0) || Number(item.paidAmount || 0);

        return {
          ...item,
          returnNo: item._id?.slice(-6).toUpperCase(),
          customerName: item.customer?.name || item.customer?.customerName || "N/A",
          customerState: item.customer?.state || item.stateOrRegion || "N/A",
          customerOffice: item.customer?.address || item.customer?.office || "",
          grandTotal: item.grandTotal || 0,
          paidAmount: totalPaid,
          payments: paymentsArr,
          products: Array.isArray(item.products)
            ? item.products.map((p) => ({
                ...p,
                productName: p.product?.name || p.product?.productName || "Product",
                orderQuantity: p.quantity || 1,
                unitPrice: p.unitPrice || 0,
                discountType: p.discountType || "fixed",
                discountValue: p.discountValue || 0,
                discountAmount: p.discountAmount || 0,
                total: p.afterDiscount || p.totalPrice || 0,
              }))
            : [],
        };
      });

      setReturnsList(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sell returns.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      setIsDataLoading(true);
      const data = await fetchSaleDependencies();

      setStates(Array.isArray(data.states) ? data.states : []);
      setCustomers(Array.isArray(data.customers) ? data.customers : []);
      setProducts(Array.isArray(data.products) ? data.products : []);
      setProductsGroupSubgroup(Array.isArray(data.productsGroupSubgroup) ? data.productsGroupSubgroup : []);
      setSubgroupsList(Array.isArray(data.subgroups) ? data.subgroups : []);
    } catch (err) {
      console.error("Error loading dependency data:", err);
      toast.error("Failed to load dependency data for sell return.");
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleEditReturn = (returnOrder) => {
    setEditingId(returnOrder._id);

    const regionStr = returnOrder.customerState || returnOrder.stateOrRegion || "";
    if (regionStr) setSelectedState({ value: regionStr, label: regionStr });

    const custIdVal = returnOrder.customer?._id || returnOrder.customer?.id || returnOrder.customer;
    const foundCust = customers.find(
      (c) => String(c._id) === String(custIdVal) || String(c.id) === String(custIdVal) || c.name === returnOrder.customerName || c.customerName === returnOrder.customerName
    );
    if (foundCust) {
      setSelectedCustomer({
        value: foundCust._id || foundCust.id,
        label: foundCust.customerName || foundCust.name,
      });
    }

    if (returnOrder.returnDate) {
      const formattedDate = new Date(returnOrder.returnDate).toISOString().split("T")[0];
      setReturnDate(formattedDate);
    }

    // 🟢 আগের ডিসকাউন্ট ভ্যালু এবং টাইপ সঠিকভাবে এডিট ফর্মে লোড করা হলো যাতে ইউজার ক্লিক করে পরিবর্তন করতে পারে
    const rawDiscType = returnOrder.generalDiscountType;
    const isPercent = rawDiscType === "percentage" || rawDiscType === "percent" || rawDiscType === "%";
    
    setGlobalDiscount({
      type: isPercent ? "percent" : "flat",
      value: returnOrder.generalDiscountValue !== undefined ? Number(returnOrder.generalDiscountValue) : 0,
    });

    const loadedPayments = Array.isArray(returnOrder.payments) ? returnOrder.payments : [];
    setPaymentHistory(loadedPayments);
    const totalPrevPaid = loadedPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
    setPreviousPaidTotal(totalPrevPaid);
    setPaidAmount(0);

    if (Array.isArray(returnOrder.products) && returnOrder.products.length > 0) {
      const mappedRows = returnOrder.products.map((item) => {
        const targetProdId = item.product?._id || item.product;
        const matchedProd = products.find(
          (p) => String(p._id) === String(targetProdId) || String(p.id) === String(targetProdId)
        );

        return {
          selectedGroup: item.group?._id || item.group || matchedProd?.group?._id || matchedProd?.group || null,
          selectedSubGroup: item.subGroup?._id || item.subGroup || matchedProd?.subGroup?._id || matchedProd?.subGroup || null,
          productId: matchedProd ? { value: matchedProd._id || matchedProd.id, label: matchedProd.name || matchedProd.productName } : targetProdId,
          productName: item.productName || matchedProd?.name || "",
          currentStock: matchedProd?.currentStock ?? 0,
          orderQty: item.quantity || item.orderQuantity || 0,
          unitPrice: item.unitPrice || 0,
          discountType: item.discountType === "percentage" || item.discountType === "percent" ? "percent" : "flat",
          discountValue: Number(item.discountValue) || 0,
        };
      });
      setItems([...mappedRows, { ...initialRow }]);
    }

    setActiveTab("create");
  };

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
    if (!currentState || currentState === "All" || currentState === "All States") return customers;
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
    
    if (globalDiscount.type === "percent" || globalDiscount.type === "percentage") {
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
      toast.error("Please select at least one product with valid return quantity!", { autoClose: 2500 });
      return;
    }

    const customerId = selectedCustomer?.value || selectedCustomer;
    if (!customerId) {
      toast.error("Please select a customer!", { autoClose: 2500 });
      return;
    }

    const stateVal = selectedState ? (selectedState?.value || selectedState) : "";
    if (!stateVal || stateVal === "All" || stateVal === "All States") {
      toast.error("Please select a valid State / Region!", { autoClose: 2500 });
      return;
    }

    Swal.fire({
      title: editingId ? "Update Sell Return?" : "Confirm Sell Return?",
      text: editingId ? "This will update the existing sell return details & adjust stock." : "This will add the returned products back to the store stock.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#64748b",
      confirmButtonText: editingId ? "Update Return" : "Confirm Return",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const newPaidNum = Number(paidAmount) || 0;
          let updatedPayments = [...paymentHistory];
          if (newPaidNum > 0) {
            updatedPayments.push({ date: new Date().toISOString(), amount: newPaidNum, paymentMethod: "Cash" });
          }

          const payload = {
            stateOrRegion: stateVal,
            customer: customerId,
            returnDate: new Date(returnDate).toISOString(),
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
            generalDiscountType: globalDiscount.type === "percent" || globalDiscount.type === "percentage" ? "percentage" : "fixed",
            generalDiscountValue: Number(globalDiscount.value || 0),
            grandTotal: calculations.grandTotal,
            paidAmount: calculations.totalPaidCalculated,
            payments: updatedPayments,
            status: calculations.dueAmount <= 0 ? "completed" : "pending",
          };

          if (editingId) {
            await useSellReturnServices.updateSellReturn(editingId, payload);
            toast.success("Sell return updated successfully!");
          } else {
            await useSellReturnServices.createSellReturn(payload);
            toast.success("Sell return recorded and store stock updated successfully!");
          }

          resetForm();
          setActiveTab("list");
          fetchReturns();
        } catch (error) {
          console.error("Submission error:", error);
          toast.error(error.message || "Failed to process sell return.");
        }
      }
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setItems([{ ...initialRow }]);
    setSelectedState(null);
    setSelectedCustomer(null);
    setReturnDate(getTodayISO());
    setGlobalDiscount({ type: "flat", value: 0 });
    setPaidAmount(0);
    setPreviousPaidTotal(0);
    setPaymentHistory([]);
  };

  if (isDataLoading) {
    return <div className="p-6 text-center text-gray-500 font-medium">Loading form dependencies...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 relative">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sell Return Management</h1>
            <p className="text-sm text-gray-500">
              Manage product returns from customers and automatically update store stock.
            </p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
            <button
              onClick={() => {
                resetForm();
                setActiveTab("list");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "list" ? "bg-orange-600 text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Return Lists
            </button>
            <button
              onClick={() => {
                resetForm();
                setActiveTab("create");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "create" ? "bg-orange-600 text-white shadow-xs" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              + Create Sell Return
            </button>
          </div>
        </div>

        {activeTab === "list" ? (
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-xs">
            <table className="table w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 border-b border-gray-200 text-xs uppercase tracking-wider">
                  <th className="p-3">Date</th>
                  <th className="p-3">Return No</th>
                  <th className="p-3">Client Info</th>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-right">Due</th>
                  <th className="p-3 text-right">Grand Total</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-gray-500 font-medium">
                      Loading sell returns...
                    </td>
                  </tr>
                ) : returnsList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-12 text-center text-gray-500 font-medium">
                      No sell returns recorded yet.
                    </td>
                  </tr>
                ) : (
                  returnsList.map((item, index) => (
                    <SingleSellReturn
                      key={item._id || index}
                      returnOrder={item}
                      onEdit={handleEditReturn}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <RotateCcw className="size-6 text-orange-600" />
              <h2 className="text-lg font-bold">
                {editingId ? "Edit Sell Return" : "Create Sell Return"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <SaleHeader
                states={states}
                customerOptions={customerOptions}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                orderDate={returnDate}
                setOrderDate={setReturnDate}
                convertToDDMMYYYY={(d) => (d ? d.split("-").reverse().join("/") : "")}
                dateInputRef={dateInputRef}
              />

              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <Box className="size-4" /> Returned Product Selection & Pricing
                </h4>

                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-base-300/40 rounded-lg text-[11px] font-semibold text-base-content/70 text-center justify-end">
                  <div className="flex-1 text-left">Group</div>
                  <div className="flex-1 text-left">Sub-Group</div>
                  <div className="flex-1 text-left">Product</div>
                  <div className="w-16">Stock</div>
                  <div className="w-16">Return Qty</div>
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

              <SaleSummaryBar totalOrderQty={calculations.totalOrderQty} rawSubtotal={calculations.rawSubtotal} />

              <SaleCalculation
                globalDiscount={globalDiscount}
                setGlobalDiscount={setGlobalDiscount}
                paidAmount={paidAmount}
                setPaidAmount={setPaidAmount}
                calculations={calculations}
              />

              {editingId && (
                <div className="w-full bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-gray-700 flex items-center gap-1.5">
                    <History className="size-4 text-orange-600" /> Payment History (Previous)
                  </h4>
                  <div className="space-y-1">
                    {paymentHistory.length === 0 ? (
                      <p className="text-gray-400">No previous payments.</p>
                    ) : (
                      paymentHistory.map((p, i) => (
                        <div key={i} className="flex justify-between border-b pb-1 border-gray-200">
                          <span>{p.date ? new Date(p.date).toLocaleDateString() : "N/A"}</span>
                          <span className="font-bold text-emerald-600">৳{p.amount}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="text-gray-500 font-medium pt-1">
                    Total Paid Previously: <span className="font-bold text-emerald-600">৳{previousPaidTotal}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab("list");
                  }}
                  className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn bg-orange-600 hover:bg-orange-700 text-white px-8 cursor-pointer">
                  {editingId ? "Update Sell Return" : "Submit Sell Return"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellReturn;