import  { useState, useEffect, useMemo, useRef } from "react";
import { ShoppingCart, Box } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import SaleHeader from "./SaleHeader";
import SaleItemRow from "./SaleItemRow";
import SaleSummaryBar from "./SaleSummaryBar";
import SaleCalculation from "./SaleCalculation";

const CreateSale = ({ editData = null, onUpdateSuccess = () => {} }) => {
  const [states, setStates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsGroupSubgroup, setProductsGroupSubgroup] = useState([]);
  const [loading, setLoading] = useState(true);

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
    orderQty: 1,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stateRes, custRes, prodRes, groupRes] = await Promise.all([
          fetch("/customerCountryState.json"),
          fetch("/customers.json"),
          fetch("/products.json"),
          fetch("/productsGroupSubgroup.json"),
        ]);

        const stateData = await stateRes.json();
        const custData = custRes.ok ? await custRes.json() : [];
        const prodData = await prodRes.json();
        const groupData = await groupRes.json();

        setStates(Array.isArray(stateData) ? stateData : []);
        setCustomers(Array.isArray(custData) ? custData : []);
        setProducts(Array.isArray(prodData) ? prodData : []);
        setProductsGroupSubgroup(Array.isArray(groupData) ? groupData : []);

        if (editData) {
          if (editData.state) {
            setSelectedState({ value: editData.state, label: editData.state });
          }
          if (editData.customerName) {
            setSelectedCustomer({ value: editData.customerName, label: editData.customerName });
          }
          
          if (editData.orderDate) {
            const parts = editData.orderDate.split("/");
            if (parts.length === 3) {
              setOrderDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
            } else {
              setOrderDate(editData.orderDate);
            }
          }

          if (editData.soldItems && editData.soldItems.length > 0) {
            const mappedEditItems = editData.soldItems.map(item => ({
              ...item,
              selectedGroup: item.selectedGroup ? { value: item.selectedGroup, label: item.selectedGroup } : null,
              selectedSubGroup: item.selectedSubGroup ? { value: item.selectedSubGroup, label: item.selectedSubGroup } : null,
              productId: item.productId ? { value: item.productId, label: item.productName || item.productId } : null,
            }));
            setItems([...mappedEditItems, { ...initialRow }]);
          }

          if (editData.globalDiscount) {
            setGlobalDiscount({
              type: editData.globalDiscount.type || "percent",
              value: editData.globalDiscount.value || 0,
            });
          }

          if (editData.totals) {
            setPaidAmount(editData.totals.paidAmount || 0);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to load dependency data for sales.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editData]);

  const availableGroups = useMemo(() => {
    if (!Array.isArray(productsGroupSubgroup)) return [];
    return productsGroupSubgroup
      .map((item) => {
        const name = item.group || item.groupName || item.name;
        return name ? { value: name, label: name } : null;
      })
      .filter(Boolean);
  }, [productsGroupSubgroup]);

  // "All" ba khali thakle shob customer dekhabe, nirdisto state thakle filter hobe
  const filteredCustomers = useMemo(() => {
    const currentState = selectedState?.value || selectedState;
    if (!currentState || currentState === "All") {
      return customers;
    }
    return customers.filter(
      (c) => c.state === currentState || c.customerState === currentState
    );
  }, [customers, selectedState]);

  const customerOptions = useMemo(() => {
    return Array.isArray(filteredCustomers)
      ? filteredCustomers.map((c) => ({
          value: c?.customerName || c?.name,
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
        (p) => p.productId === targetId || p._id === targetId
      );
      if (selectedProd) {
        currentRow.productName =
          selectedProd.productName || selectedProd.name || "";
        currentRow.currentStock =
          selectedProd.quantity ?? selectedProd.currentStock ?? 0;
        currentRow.unitPrice =
          selectedProd.unitPrice ?? selectedProd.sellingPrice ?? selectedProd.price ?? 0;
      }
    } else if (["orderQty", "unitPrice", "discountValue"].includes(field)) {
      currentRow[field] = value === "" ? "" : Number(value);
    } else if (field === "discountType") {
      currentRow.discountType = value;
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

  const convertToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
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
      if (item.discountType === "percent") {
        discountAmount = (totalPrice * dVal) / 100;
      } else {
        discountAmount = dVal;
      }

      const afterDiscountPrice = Math.max(0, totalPrice - discountAmount);

      return {
        ...item,
        productId: item.productId?.value || item.productId,
        selectedGroup: item.selectedGroup?.value || item.selectedGroup,
        selectedSubGroup: item.selectedSubGroup?.value || item.selectedSubGroup,
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
    const paidNum = Number(paidAmount) || 0;
    const dueAmount = Math.max(0, grandTotal - paidNum);

    return {
      totalOrderQty,
      calculatedItems,
      rawSubtotal,
      globalDiscountAmount,
      grandTotal,
      dueAmount,
    };
  }, [items, globalDiscount, paidAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validItems = calculations.calculatedItems.filter(
      (item) => item.productId !== null && item.productId !== ""
    );

    if (validItems.length === 0) {
      toast.error("Please select at least one product!", { autoClose: 2500 });
      return;
    }

    const customerVal = selectedCustomer?.value || selectedCustomer;

    if (!customerVal) {
      toast.error("Please select Customer!", { autoClose: 2500 });
      return;
    }

    const actionTitle = editData ? "Update Sale Order?" : "Confirm Sale Order?";
    const actionText = editData ? "This will update the existing sales transaction." : "This will create a new sales transaction.";
    const confirmBtnText = editData ? "Update Sale" : "Confirm Sale";

    Swal.fire({
      title: actionTitle,
      text: actionText,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#64748b",
      confirmButtonText: confirmBtnText,
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "btn btn-sm text-white px-4 border-0",
        cancelButton: "btn btn-sm btn-ghost px-4",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const stateVal = selectedState ? (selectedState?.value || selectedState) : "";
        const saleData = {
          ...(editData && editData._id ? { _id: editData._id } : {}),
          state: stateVal === "All" ? "" : stateVal,
          customerName: customerVal,
          orderDate: convertToDDMMYYYY(orderDate),
          soldItems: validItems,
          globalDiscount: {
            ...globalDiscount,
            amount: calculations.globalDiscountAmount,
          },
          totals: {
            orderQty: calculations.totalOrderQty,
            subtotal: calculations.rawSubtotal,
            grandTotal: calculations.grandTotal,
            paidAmount: Number(paidAmount) || 0,
            dueAmount: calculations.dueAmount,
          },
          date: new Date().toISOString(),
        };

        if (editData) {
          toast.success("Sell order updated successfully!", { autoClose: 2000 });
          onUpdateSuccess(saleData);
        } else {
          toast.success("Sell order created successfully!", { autoClose: 2000 });
          setItems([{ ...initialRow }]);
          setSelectedState(null);
          setSelectedCustomer(null);
          setOrderDate(getTodayISO());
          setGlobalDiscount({ type: "percent", value: 0 });
          setPaidAmount(0);
        }
      }
    });
  };

  if (loading) return <div className="p-6">Loading sale form data...</div>;

  return (
    <div className="w-full min-h-[calc(100vh-20px)] mt-[10px] px-[20px] pb-10 bg-base-100 box-border">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-base-300">
        <ShoppingCart className="size-6 text-teal-600" />
        <h1 className="text-xl font-bold">
          {editData ? "Edit Sale Order" : "Create Sale Order"}
        </h1>
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
          convertToDDMMYYYY={convertToDDMMYYYY}
          dateInputRef={dateInputRef}
        />

        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
            <Box className="size-4" /> Product Selection & Pricing
          </h4>

          {/* Equal Flex Sizing Header - Aligned to Right */}
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
              productsGroupSubgroup={productsGroupSubgroup}
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
            className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white px-8"
          >
            {editData ? "Update Sale Order" : "Create Sale Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSale;