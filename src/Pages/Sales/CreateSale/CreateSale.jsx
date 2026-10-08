import { useState, useEffect, useMemo, useRef } from "react";
import { ShoppingCart, Box } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import SaleHeader from "./SaleHeader";
import SaleItemRow from "./SaleItemRow";
import SaleSummaryBar from "./SaleSummaryBar";
import SaleCalculation from "./SaleCalculation";
import { fetchSaleDependencies, createSaleOrder } from "../../../services/saleOrderService/useSaleOrderServices";

const CreateSale = ({ editData = null, onUpdateSuccess = () => {} }) => {
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
        setIsLoading(true);
        const data = await fetchSaleDependencies();

        setStates(Array.isArray(data.states) ? data.states : []);
        setCustomers(Array.isArray(data.customers) ? data.customers : []);
        setProducts(Array.isArray(data.products) ? data.products : []);
        setProductsGroupSubgroup(Array.isArray(data.productsGroupSubgroup) ? data.productsGroupSubgroup : []);
        setSubgroupsList(Array.isArray(data.subgroups) ? data.subgroups : []);
      } catch (err) {
        console.error("Error loading dependency data:", err);
        toast.error("Failed to load initial data for sales.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          value: c?.id || c?._id,
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
        (p) => p._id === targetId || p.id === targetId || p.productId === targetId
      );
      if (selectedProd) {
        currentRow.productName = selectedProd.name || selectedProd.productName || "";
        currentRow.currentStock = selectedProd.quantity ?? selectedProd.currentStock ?? 0;
        currentRow.unitPrice = selectedProd.sellingPrice ?? selectedProd.unitPrice ?? selectedProd.price ?? 0;
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

      const targetProdId = item.productId?.value || item.productId;
      const matchedProd = products.find(p => p._id === targetProdId || p.id === targetProdId || p.productId === targetProdId);

      return {
        ...item,
        groupId: matchedProd?.group?._id || matchedProd?.group || item.selectedGroup?.value || item.selectedGroup,
        subGroupId: matchedProd?.subGroup?._id || matchedProd?.subGroup || item.selectedSubGroup?.value || item.selectedSubGroup,
        productObjId: matchedProd?._id || matchedProd?.id || targetProdId,
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
  }, [items, globalDiscount, paidAmount, products]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validItems = calculations.calculatedItems.filter(
      (item) => item.productId !== null && item.productId !== ""
    );

    if (validItems.length === 0) {
      toast.error("Please select at least one product!", { autoClose: 2500 });
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
      title: "Confirm Sale Order?",
      text: "This will create a new sales transaction with 'pending' status.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d9488",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Confirm Sale",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "btn btn-sm text-white px-4 border-0",
        cancelButton: "btn btn-sm btn-ghost px-4",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const saleOrderPayload = {
            stateOrRegion: stateVal,
            customer: customerId,
            orderDate: new Date(orderDate).toISOString(),
            products: validItems.map((item) => ({
              group: item.groupId,
              subGroup: item.subGroupId,
              product: item.productObjId,
              quantity: Number(item.orderQty),
              price: Number(item.unitPrice),
              discount: Number(item.discountValue || 0),
            })),
            generalDiscountType: globalDiscount.value > 0 ? (globalDiscount.type === "percent" ? "%" : "flat") : undefined,
            generalDiscountValue: Number(globalDiscount.value || 0),
            paidAmount: Number(paidAmount || 0),
            status: "pending",
          };

          await createSaleOrder(saleOrderPayload);
          toast.success("Sell order created successfully!", { autoClose: 2000 });
          
          setItems([{ ...initialRow }]);
          setSelectedState(null);
          setSelectedCustomer(null);
          setOrderDate(getTodayISO());
          setGlobalDiscount({ type: "percent", value: 0 });
          setPaidAmount(0);
        } catch (error) {
          console.error("Submission error:", error);
          toast.error(error.message || "Failed to save sale order.");
        }
      }
    });
  };

  if (isLoading) return <div className="p-6">Loading sale form data...</div>;

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
            className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white px-8"
          >
            Create Sale Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSale;