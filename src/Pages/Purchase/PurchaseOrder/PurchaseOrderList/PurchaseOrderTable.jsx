
import { Search } from "lucide-react";
import PurchaseOrderRow from "./PurchaseOrderRow";

const PurchaseOrderTable = ({
  orders,
  loading,
  searchTerm,
  setSearchTerm,
  onStatusChange,
  onEditOrder,
}) => {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <div className="relative w-full sm:w-72">
          <Search className="absolute inset-y-0 left-3 my-auto size-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search by Invoice ID or Supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered input-sm w-full pl-9 rounded-xl focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-base-200/50 text-base-content/70 text-xs uppercase tracking-wider border-b border-base-300">
              <th className="py-3 px-4 font-semibold">Order / Invoice No</th>
              <th className="py-3 px-4 font-semibold">Supplier Name</th>
              <th className="py-3 px-4 font-semibold">Order Date</th>
              <th className="py-3 px-4 font-semibold">Receive Date</th>
              <th className="py-3 px-4 font-semibold">Total Amount</th>
              <th className="py-3 px-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-base-content/50">
                  Loading purchase orders...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <PurchaseOrderRow
                  key={order.orderID}
                  order={order}
                  onStatusChange={onStatusChange}
                  onEditOrder={onEditOrder}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-base-content/50">
                  No purchase orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PurchaseOrderTable;