// src/components/sale/CreateSale.jsx
import { useState, useMemo, useRef } from "react";
import { ShoppingCart, Box, Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import SaleHeader from "./SaleHeader";
import SaleItemRow from "./SaleItemRow";
import SaleSummaryBar from "./SaleSummaryBar";
import SaleCalculation from "./SaleCalculation";
import { fetchSaleDependencies, createSaleOrder } from "../../../services/saleOrderService/useSaleOrderServices";

const CreateSale = ({ onSuccess = () => {} }) => {
  const queryClient = useQueryClient();

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

  // 🟢 React Query ব্যবহার করে ডিপেন্ডেন্সি ডেটা দ্রুত লোড ও ক্যাশ করা হলো
  const { data: dependencyData, isLoading } = useQuery({
    queryKey: ["saleDependencies"],
    queryFn: fetchSaleDependencies,
    staleTime: 1000 * 60 * 5, // ৫ মিনিট ডেটা ফ্রেশ রাখবে
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // ব্যাকগ্রাউন্ড রিফেচের সময়ও আগের ডেটা ধরে রাখবে
  });

  const states = Array.isArray(dependencyData?.states) ? dependencyData.states : [];
  const customers = Array.isArray(dependencyData?.customers) ? dependencyData.customers : [];
  const products = Array.isArray(dependencyData?.products) ? dependencyData.products : [];
  const productsGroupSubgroup = Array.isArray(dependencyData?.productsGroupSubgroup) ? dependencyData.productsGroupSubgroup : [];
  const subgroupsList = Array.isArray(dependencyData?.subgroups) ? dependencyData.subgroups : [];

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
      const targetId = typeof value === "object" && value !== null ? (value.value || value._id || value.id) : value;
      
      const selectedProd = products.find(
        (p) => 
          String(p._id) === String(targetId) || 
          String(p.id) === String(targetId) || 
          String(p.product) === String(targetId) || 
          String(p.product?._id) === String(targetId)
      );

      if (selectedProd) {
        currentRow.productName = selectedProd.name || selectedProd.productName || selectedProd.product?.name || "";
        currentRow.currentStock = selectedProd.currentStock !== undefined ? Number(selectedProd.currentStock) : (Number(selectedProd.quantity) || 0);
        currentRow.unitPrice = selectedProd.sellingPrice ?? selectedProd.unitPrice ?? selectedProd.price ?? 0;
        currentRow.selectedGroup = selectedProd.group?._id || selectedProd.group?._id || selectedProd.group || currentRow.selectedGroup;
        currentRow.selectedSubGroup = selectedProd.subGroup?._id || selectedProd.subGroup?._id || selectedProd.subGroup || currentRow.selectedSubGroup;
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

      const groupId = matchedProd?.group?._id || matchedProd?.group || (typeof item.selectedGroup === "object" ? (item.selectedGroup?.value || item.selectedGroup?._id) : item.selectedGroup);
      const subGroupId = matchedProd?.subGroup?._id || matchedProd?.subGroup || (typeof item.selectedSubGroup === "object" ? (item.selectedSubGroup?.value || item.selectedSubGroup?._id) : item.selectedSubGroup);
      const productObjId = matchedProd?._id || matchedProd?.id || matchedProd?.product?._id || targetId;

      return {
        ...item,
        discountType: dType,
        discountValue: dVal,
        groupId,
        subGroupId,
        productObjId,
        currentStock: matchedProd?.currentStock !== undefined ? Number(matchedProd.currentStock) : item.currentStock,
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
    const totalPaidCalculated = Number(paidAmount) || 0;
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
  }, [items, globalDiscount, paidAmount, products]);

  // 🟢 মিউটেশন ব্যবহার করে সেল অর্ডার সাবমিট করা এবং ক্যাশ ইনভ্যালিডেট করা
  const createOrderMutation = useMutation({
    mutationFn: createSaleOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saleDependencies"] });
      toast.success("Sell order created successfully!", { autoClose: 2000 });
      
      setItems([{ ...initialRow }]);
      setSelectedState(null);
      setSelectedCustomer(null);
      setOrderDate(getTodayISO());
      setGlobalDiscount({ type: "percent", value: 0 });
      setPaidAmount(0);

      onSuccess();
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to save sale order.");
    },
  });

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

    for (const [idx, item] of validItems.entries()) {
      if (!item.groupId || !item.subGroupId || !item.productObjId) {
        toast.error(`Row ${idx + 1}: Group, Sub-Group, and Product IDs are missing!`, { autoClose: 3000 });
        return;
      }
    }

    Swal.fire({
      title: "Confirm Sale Order?",
      text: "This will create a new sales transaction and update stock inventory.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Confirm Sale",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const paymentsArray = Number(paidAmount) > 0 
          ? [{ date: new Date(orderDate).toISOString(), amount: Number(paidAmount), paymentMethod: "Cash" }]
          : [];

        const saleOrderPayload = {
          stateOrRegion: stateVal,
          customer: customerId,
          orderDate: new Date(orderDate).toISOString(),
          products: validItems.map((item) => ({
            state: stateVal,
            customer: customerId,
            group: typeof item.groupId === "object" ? item.groupId._id || item.groupId.value : item.groupId,
            subGroup: typeof item.subGroupId === "object" ? item.subGroupId._id || item.subGroupId.value : item.subGroupId,
            product: typeof item.productObjId === "object" ? item.productObjId._id || item.productObjId.value : item.productObjId,
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
          payments: paymentsArray,
          status: "pending",
        };

        createOrderMutation.mutate(saleOrderPayload);
      }
    });
  };

  // প্রথমবার লোড হওয়ার সময় স্পিনার দেখাবে, ক্যাশ থাকলে ইনস্ট্যান্ট ওপেন হবে
  if (isLoading && customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="size-10 animate-spin text-teal-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading create sale form...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-20px)] mt-[10px] px-[20px] pb-10 bg-base-100 box-border">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-base-300">
        <ShoppingCart className="size-6 text-teal-600" />
        <h1 className="text-xl font-bold">Create Sale Order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <SaleCalculation
          globalDiscount={globalDiscount}
          setGlobalDiscount={setGlobalDiscount} 
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          calculations={calculations}
        />

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={createOrderMutation.isLoading}
            className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white px-8"
          >
            {createOrderMutation.isLoading ? <Loader2 className="size-4 animate-spin" /> : "Create Sale Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

CreateSale.displayName = "CreateSale";
export default CreateSale;