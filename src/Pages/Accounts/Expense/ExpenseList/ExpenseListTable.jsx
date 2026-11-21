import { PrinterCheck } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_OPTIONS = ["Pending", "Hold", "Approved"];

const ExpenseListTable = ({ expenses = [], onStatusChange, onEditClick }) => {
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [activeNoteModal, setActiveNoteModal] = useState(null);

  const handleSelectChange = (expenseId, status) => {
    setSelectedStatuses((prev) => ({ ...prev, [expenseId]: status }));
    if (onStatusChange) {
      onStatusChange(expenseId, status);
    }
  };

  // 📄 Half A4 Size PDF & Print/Download Handler
  const handlePrintOrDownloadInvoice = (row) => {
    // Custom Half A4 page size: [Width: 210mm, Height: 148mm]
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [148, 210],
    });

    // 1. Header Title (Shifted down for better top-gap balance)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("VOUCHER", 105, 25, { align: "center" });

    // Header Divider Line
    doc.setLineWidth(0.4);
    doc.setDrawColor(203, 213, 225);
    doc.line(15, 30, 195, 30);

    // 2. Metadata: Voucher ID (Left) & Date (Right)
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`Voucher ID: ${row.id}`, 15, 38);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Date: ${row.date || new Date().toLocaleDateString()}`, 195, 38, {
      align: "right",
    });

    // 3. Main Table Setup with Centered Alignment
    autoTable(doc, {
      startY: 43,
      head: [["Expense Head", "Sub Head", "Amount (BDT)"]],
      body: [[row.expenseHead, row.expenseSubHead, `BDT ${row.amount}`]],
      theme: "grid",
      margin: { left: 15, right: 15 },
      headStyles: {
        fillColor: [79, 70, 229], // Indigo 600
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      styles: {
        fontSize: 9.5,
        cellPadding: 4,
        halign: "center",
        valign: "middle",
      },
    });

    // 4. Total Amount & Note Calculation
    const currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 70;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`Total Amount: BDT ${row.amount}`, 15, currentY);

    if (row.note) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 116, 139);
      doc.text(`Note: ${row.note}`, 15, currentY + 6);
    }

    // 5. Balanced Bottom Signatures (125mm Y-axis leaves exact equal padding at the bottom)
    const sigY = 125;
    doc.setLineWidth(0.3);
    doc.setDrawColor(100, 116, 139);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);

    // Signature 1: Prepared By (Left)
    doc.line(15, sigY, 60, sigY);
    doc.text("Prepared By", 37.5, sigY + 4, { align: "center" });

    // Signature 2: Checked By (Center)
    doc.line(82, sigY, 128, sigY);
    doc.text("Checked By", 105, sigY + 4, { align: "center" });

    // Signature 3: Receiver Signature (Right)
    doc.line(150, sigY, 195, sigY);
    doc.text("Receiver Signature", 172.5, sigY + 4, { align: "center" });

    // Native Print Preview Dialog
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase">
              <th className="p-3 border-r">ID</th>
              <th className="p-3 border-r">Date</th>
              <th className="p-3 border-r">Expense Head</th>
              <th className="p-3 border-r">Expense Sub Head</th>
              <th className="p-3 border-r">Paid From</th>
              <th className="p-3 border-r">Amount</th>
              <th className="p-3 border-r">Note</th>
              <th className="p-3 border-r text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {expenses.length > 0 ? (
              expenses.map((row) => {
                const currentStatus =
                  selectedStatuses[row.id] || row.status || "Pending";
                const isApproved = currentStatus === "Approved";

                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 border-r font-bold text-indigo-600">
                      {row.id}
                    </td>
                    <td className="p-3 border-r">{row.date}</td>
                    <td className="p-3 border-r font-semibold text-slate-800">
                      {row.expenseHead}
                    </td>
                    <td className="p-3 border-r text-slate-600">
                      {row.expenseSubHead}
                    </td>
                    <td className="p-3 border-r font-medium">
                      {row.paidFrom}
                    </td>
                    <td className="p-3 border-r font-bold text-slate-900">
                      ৳{row.amount}
                    </td>

                    {/* Note Field */}
                    <td className="p-3 border-r relative max-w-[150px]">
                      <span
                        className="truncate block text-slate-600"
                        title={row.note}
                      >
                        {row.note}
                      </span>
                      {row.note && row.note.length > 20 && (
                        <button
                          onClick={() => setActiveNoteModal(row.note)}
                          className="text-[10px] text-indigo-600 underline font-semibold mt-0.5 cursor-pointer"
                        >
                          View Full Note
                        </button>
                      )}
                    </td>

                    {/* Dynamic Status Dropdown */}
                    <td className="p-2 border-r text-center">
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          handleSelectChange(row.id, e.target.value)
                        }
                        className={`border rounded-lg p-1.5 font-bold text-[11px] outline-none cursor-pointer ${
                          currentStatus === "Approved"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                            : currentStatus === "Hold"
                            ? "bg-rose-50 border-rose-300 text-rose-700"
                            : "bg-amber-50 border-amber-300 text-amber-700"
                        }`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Edit Button */}
                        <button
                          title={
                            isApproved
                              ? "Approved expenses cannot be edited"
                              : "Edit Expense"
                          }
                          disabled={isApproved}
                          onClick={() => !isApproved && onEditClick(row)}
                          className={`p-1.5 rounded-md font-bold text-[11px] transition ${
                            isApproved
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                          }`}
                        >
                          ✏️ Edit
                        </button>

                        {/* Print/Download Button */}
                        <button
                          title="Print or Download Voucher"
                          onClick={() => handlePrintOrDownloadInvoice(row)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-md transition cursor-pointer flex items-center justify-center"
                        >
                          <PrinterCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="p-8 text-center text-slate-400 font-medium"
                >
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Note Popup Modal */}
      {activeNoteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Full Expense Note
            </h3>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border leading-relaxed mb-4">
              {activeNoteModal}
            </p>
            <button
              onClick={() => setActiveNoteModal(null)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseListTable;