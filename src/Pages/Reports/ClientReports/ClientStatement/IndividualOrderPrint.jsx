import React from 'react';

const IndividualOrderPrint = ({
  companyName = "MEDIDENT",
  companyAddress = "Mirpur, Dhaka, Bangladesh",
  companyPhone = "+880 1XXX-XXXXXX",
  order = null,
  customerObj = null,
  autoAddress = "",
}) => {
  if (!order) return null;

  const orderDateStr = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-GB') : '-';
  const grandTotal = Number(order.grandTotal) || 0;
  const dueAmount = Number(order.dueAmount) || 0;
  const paidAmount = grandTotal - dueAmount;

  return (
    <div className="hidden print:block print:w-full print:bg-white print:text-black font-sans text-xs">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-4">
        <div className="space-y-1 max-w-[50%]">
          <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
            {companyName}
          </h2>
          <p className="text-[11px] text-slate-700">{companyAddress}</p>
          <p className="text-[11px] text-slate-700">Phone: {companyPhone}</p>
        </div>
        <div className="text-right space-y-1 max-w-[45%]">
          <h1 className="text-lg font-black uppercase tracking-wider text-slate-900">
            ORDER INVOICE / REPORT
          </h1>
          <p className="text-[11px] text-slate-700">Order ID: #{order._id}</p>
          <p className="text-[11px] text-slate-700">Date: {orderDateStr}</p>
        </div>
      </div>

      {/* Customer & Order Meta */}
      <div className="grid grid-cols-2 gap-8 mb-5 text-[11px] border-b border-slate-300 pb-4">
        <div className="space-y-1.5">
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Customer Name</span>
            <span className="font-extrabold uppercase">: {order.customer?.name || customerObj?.name || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Customer Address</span>
            <span>: {autoAddress || order.customer?.address || "N/A"}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Order Status</span>
            <span className="uppercase font-bold text-blue-700">: {order.status || 'Pending'}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-bold text-slate-700">Print Date</span>
            <span>: {new Date().toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">
          Products List
        </h3>
        <table className="w-full border-collapse border border-slate-400 text-[11px]">
          <thead>
            <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
              <th className="p-2 border-r border-slate-400 text-left">SL</th>
              <th className="p-2 border-r border-slate-400 text-left">Product Name</th>
              <th className="p-2 border-r border-slate-400 text-center">Qty</th>
              <th className="p-2 border-r border-slate-400 text-right">Unit Price</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.map((prod, idx) => (
              <tr key={idx} className="border-b border-slate-300">
                <td className="p-2 border-r border-slate-300 text-left">{idx + 1}</td>
                <td className="p-2 border-r border-slate-300 font-medium">{prod.product?.name || prod.product || 'Product Item'}</td>
                <td className="p-2 border-r border-slate-300 text-center">{prod.quantity || prod.orderQty || 1}</td>
                <td className="p-2 border-r border-slate-300 text-right">৳{prod.unitPrice || 0}</td>
                <td className="p-2 text-right font-bold">৳{prod.afterDiscount || prod.totalPrice || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment History Table */}
      {order.payments && order.payments.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">
            Payment History
          </h3>
          <table className="w-full border-collapse border border-slate-400 text-[11px]">
            <thead>
              <tr className="bg-emerald-100 text-emerald-900 font-bold border-b border-slate-400">
                <th className="p-2 border-r border-slate-400 text-left">Payment Date</th>
                <th className="p-2 border-r border-slate-400 text-left">Method</th>
                <th className="p-2 border-r border-slate-400 text-center">Status</th>
                <th className="p-2 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {order.payments.map((pay, pIdx) => (
                <tr key={pIdx} className="border-b border-slate-300">
                  <td className="p-2 border-r border-slate-300 font-medium">
                    {pay.date ? new Date(pay.date).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td className="p-2 border-r border-slate-300">{pay.paymentMethod || 'Cash'}</td>
                  <td className="p-2 border-r border-slate-300 text-center uppercase font-bold text-[10px]">
                    {pay.status || 'pending'}
                  </td>
                  <td className="p-2 text-right font-bold text-emerald-700">৳{pay.amount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Box */}
      <div className="w-72 border border-slate-400 text-[11px] mb-6 ml-auto">
        <div className="flex justify-between p-1.5 border-b border-slate-300 font-medium">
          <span>Grand Total:</span>
          <span className="font-bold">৳{grandTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between p-1.5 border-b border-slate-300 font-medium">
          <span>Paid Amount:</span>
          <span className="font-bold text-emerald-700">৳{paidAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between p-1.5 font-extrabold bg-slate-100">
          <span>Due / Unpaid:</span>
          <span className="text-rose-700">৳{dueAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 space-y-2">
        <p className="font-bold tracking-widest text-[11px] text-slate-800">
          -- END OF ORDER REPORT --
        </p>
        <p className="text-[10px] font-semibold text-slate-800 pt-2 border-t border-slate-300">
          This is a computer generated report and does not require any signature.
        </p>
      </div>
    </div>
  );
};

export default IndividualOrderPrint;
