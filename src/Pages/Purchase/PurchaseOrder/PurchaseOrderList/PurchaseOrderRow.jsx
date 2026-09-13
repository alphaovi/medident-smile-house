
import { Calendar, Printer, Edit3 } from "lucide-react";

const PurchaseOrderRow = ({ order, onStatusChange, onEditOrder }) => {
  const handlePrintOrder = (ord) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Purchase Order - ${ord.orderID}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h2 { text-align: center; margin-bottom: 5px; }
            .info { margin-bottom: 20px; font-size: 14px; }
            .info p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 14px; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h2>Purchase Order Details</h2>
          <div class="info">
            <p><strong>Order ID:</strong> ${ord.orderID}</p>
            <p><strong>Supplier Name:</strong> ${ord.supplierName}</p>
            <p><strong>Order Date:</strong> ${ord.orderDate}</p>
            <p><strong>Expected Date:</strong> ${ord.expectedDate || ord.expectedReceiveDate}</p>
          </div>
          <table>
            <thead>
              <tr><th>SL</th><th>Product Name</th><th>Quantity</th></tr>
            </thead>
            <tbody>
              ${(ord.products || ord.purchasedItems || [])
                .map(
                  (p, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${p.productName}</td>
                  <td>${p.quantity || p.orderQty}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <tr className="hover:bg-base-200/30 transition-colors">
      <td className="py-3.5 px-4 font-medium text-teal-600">{order.orderID}</td>
      <td className="py-3.5 px-4 font-medium text-base-content">{order.supplierName}</td>
      <td className="py-3.5 px-4 text-base-content/80 flex items-center gap-1.5 pt-4">
        <Calendar className="size-3.5 text-base-content/40" />
        {order.orderDate}
      </td>
      <td className="py-3.5 px-4 text-base-content/80">
        {order.expectedDate || order.expectedReceiveDate}
      </td>
      <td className="py-3.5 px-4 font-semibold text-base-content">
        ৳ {(order.totalAmount || 0).toLocaleString()}
      </td>

      {/* Action Column: স্ট্যাটাস ড্রপডাউন, এডিট এবং প্রিন্ট এক লাইনে */}
      <td className="py-3.5 px-4 text-center">
        <div className="flex items-center justify-center gap-1.5 flex-nowrap">
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order.orderID, e.target.value)}
            className="select select-bordered select-xs text-xs font-medium rounded-lg"
          >
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Received">Received</option>
          </select>

          <button
            onClick={() => onEditOrder(order)}
            className="btn btn-xs btn-outline btn-primary gap-1 cursor-pointer"
            title="Edit Order"
          >
            <Edit3 className="size-3" />
            Edit
          </button>

          <button
            onClick={() => handlePrintOrder(order)}
            className="btn btn-xs btn-outline btn-neutral gap-1 cursor-pointer"
            title="Print Order"
          >
            <Printer className="size-3" />
            Print
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PurchaseOrderRow;