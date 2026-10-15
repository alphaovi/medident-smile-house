// PurchaseOrderTable.jsx
import { Search, Edit } from "lucide-react";

const PurchaseOrderTable = ({
  orders,
  loading,
  searchTerm,
  setSearchTerm,
  onStatusChange,
  onEditOrder,
  suppliers = []
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
          <input
            type="text"
            placeholder="Search by Order ID or Supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full pl-9 text-sm focus:outline-none focus:border-teal-600"
          />
        </div>
      </div>

      {/* Purchase Order Table */}
      <div className="overflow-x-auto border border-base-300 rounded-xl shadow-sm">
        <table className="table table-zebra w-full text-left">
          <thead>
            <tr className="bg-base-200 text-base-content/80 text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Order No</th>
              <th className="py-3 px-4">Supplier Name</th>
              <th className="py-3 px-4">Order Date</th>
              <th className="py-3 px-4">Receive Date</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-base-content/60">
                  <span className="loading loading-spinner loading-md text-teal-600"></span>
                  <p className="mt-2 text-sm">Loading purchase orders...</p>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-base-content/60 font-medium">
                  No purchase orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => {
                const orderKey = order.purchaseId || order.orderID || order.orderNo || order._id || order.id || `PO-${idx + 1}`;
                
                // Format status to Title Case
                const rawStatus = order.status || order.orderStatus || order.state || "Ordered";
                const currentStatus = rawStatus.replace(/\b\w/g, (char) => char.toUpperCase());
                const isReceived = currentStatus === "Received";
                const isOnTransit = currentStatus === "On Transit";
                const isOrdered = currentStatus === "Ordered";

                // --- CHANGE HERE: Ordered ebong OnTransit thakle edit kora jabe, Received hoye gele edit block thakbe ---
                const isEditable = !isReceived;
                
                // Calculate total if missing
                let calculatedTotal = 0;
                if (order.purchasedItems && Array.isArray(order.purchasedItems)) {
                  const subtotal = order.purchasedItems.reduce((sum, item) => sum + ((item.orderQty || item.orderQuantity || 0) * (item.unitPrice || item.price || 0)), 0);
                  const exp = order.expenses || {};
                  const ship = Number(exp.shippingCost || exp.shipping || 0);
                  const trans = Number(exp.transitCost || exp.transit || 0);
                  const other = Number(exp.otherCost || exp.other || 0);
                  let vat = Number(exp.vatValue || exp.vatAmount || exp.vat || 0);
                  
                  if (exp.vatType === "percent") {
                    vat = (subtotal * vat) / 100;
                  }
                  
                  calculatedTotal = subtotal + ship + trans + other + vat;
                }

                const totalAmountVal = 
                  order.totalAmount ?? 
                  order.grandTotal ?? 
                  order.total ?? 
                  order.totals?.grandTotal ?? 
                  order.amount ?? 
                  calculatedTotal;

                // --- ROBUST SUPPLIER NAME RESOLUTION ---
                let supplierDisplay = "N/A";
                const rawSupplierRef = order.supplierName || order.supplier;

                if (typeof rawSupplierRef === "object" && rawSupplierRef !== null) {
                  supplierDisplay = rawSupplierRef.supplierName || rawSupplierRef.name || "N/A";
                } else {
                  const matchedSupplier = Array.isArray(suppliers) ? suppliers.find(
                    (s) => String(s._id) === String(rawSupplierRef) || String(s.supplierId) === String(rawSupplierRef)
                  ) : null;
                  
                  supplierDisplay = matchedSupplier ? matchedSupplier.supplierName : (rawSupplierRef || "N/A");
                }

                return (
                  <tr key={orderKey} className="hover">
                    <td className="font-semibold text-teal-600 px-4 py-3">
                      {orderKey}
                    </td>
                    <td className="font-medium px-4 py-3">{supplierDisplay}</td>
                    <td className="px-4 py-3 text-sm">{order.orderDate ? order.orderDate.split("T")[0] : "N/A"}</td>
                    <td className="px-4 py-3 text-sm">{order.expectedDeliveryDate ? order.expectedDeliveryDate.split("T")[0] : (order.expectedReceiveDate || order.expectedDate || "N/A")}</td>
                    <td className="font-semibold px-4 py-3">
                      ৳ {Number(totalAmountVal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button: isEditable = true (Ordered & On Transit), false (Received) */}
                        <button
                          type="button"
                          onClick={() => isEditable && onEditOrder(order)}
                          disabled={!isEditable}
                          className={`btn btn-ghost btn-xs cursor-pointer ${
                            isEditable 
                              ? "text-blue-600 hover:bg-blue-50" 
                              : "text-base-content/30 cursor-not-allowed hover:bg-transparent"
                          }`}
                          title={isEditable ? "Edit Order" : "Cannot edit order once it is Received"}
                        >
                          <Edit className="size-4" />
                        </button>

                        {/* Status Select: Received hoye gele dropdown o disable ba lock thakbe */}
                        <select
                          value={currentStatus}
                          disabled={isReceived}
                          onChange={(e) => onStatusChange(orderKey, e.target.value)}
                          className={`select select-xs font-semibold rounded-lg border-0 cursor-pointer w-28 px-2 ${
                            isReceived
                              ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                              : isOnTransit
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          <option value="Ordered" disabled={!isOrdered}>
                            Ordered
                          </option>
                          <option value="On Transit" disabled={isReceived}>
                            On Transit
                          </option>
                          <option value="Received">
                            Received
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderTable;