// AssetSell.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AssetSellHeader from "./AssetSellHeader";
import AssetSelectDropDown from "./AssetSelectDropDown";

const AssetSell = () => {
  // ১. স্যাম্পল ডামি ডাটা (গ্রুপ এবং সাব-গ্রুপ সহ)
  const [availableAssets, setAvailableAssets] = useState([
    {
      id: 1,
      group: "Electronics",
      subGroup: "Computers",
      invoiceId: "INV-1001",
      productName: "Laptop Dell XPS",
      originalAmount: 80000,
      depreciation: 10000,
    },
    {
      id: 2,
      group: "Furniture",
      subGroup: "Chairs",
      invoiceId: "INV-1002",
      productName: "Office Chair",
      originalAmount: 15000,
      depreciation: 2000,
    },
    {
      id: 3,
      group: "Electronics",
      subGroup: "Printers",
      invoiceId: "INV-1003",
      productName: "Old Printer",
      originalAmount: 5000,
      depreciation: 5000, // (5000 - 5000 = 0, তাই ড্রপডাউনে দেখাবে না)
    },
  ]);

  // ডামি পেমেন্ট মেথড / ব্যাংক অ্যাকাউন্ট লিস্ট
  const paymentAccounts = [
    { id: "cash", name: "Cash" },
    { id: "bank_1", name: "Dutch-Bangla Bank (DBBL)" },
    { id: "bank_2", name: "BRAC Bank" },
    { id: "bank_3", name: "Islami Bank Bangladesh" },
    { id: "bank_4", name: "City Bank" },
    { id: "bank_5", name: "Eastern Bank (EBL)" },
    { id: "mfs_bkash", name: "bKash (MFS)" },
    { id: "mfs_nagad", name: "Nagad (MFS)" },
  ];

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [sellingPrice, setSellingPrice] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(""); // পেমেন্ট অ্যাকাউন্টের স্টেট
  const [sellDate, setSellDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // সিলেক্ট করা অ্যাসেটের বেসিক ক্যালকুলেশন
  const originalCost = selectedAsset ? parseFloat(selectedAsset.originalAmount || 0) : 0;
  const currentDepreciation = selectedAsset ? parseFloat(selectedAsset.depreciation || 0) : 0;
  const currentValue = originalCost - currentDepreciation;

  // ২. সাবমিটের আগেই লাইভ Profit / Loss এবং New Depreciation ক্যালকুলেশন
  const numericSellingPrice = parseFloat(sellingPrice) || 0;
  const isSellingPriceValid = sellingPrice !== "" && !isNaN(numericSellingPrice) && numericSellingPrice >= 0;
  
  const diff = isSellingPriceValid ? numericSellingPrice - currentValue : 0;

  let liveUpdatedDepreciation = currentDepreciation;
  let statusText = "AT COST";
  let statusColor = "#64748b";

  if (isSellingPriceValid && selectedAsset) {
    if (diff > 0) {
      // Profit: Selling Price > Current Value -> Depreciation থেকে বিয়োগ হবে
      liveUpdatedDepreciation = Math.max(0, currentDepreciation - diff);
      statusText = `PROFIT (৳${diff.toFixed(2)})`;
      statusColor = "#16a34a"; // Green
    } else if (diff < 0) {
      // Loss: Selling Price < Current Value -> Depreciation এর সাথে যোগ হবে
      const lossAmount = Math.abs(diff);
      liveUpdatedDepreciation = currentDepreciation + lossAmount;
      statusText = `LOSS (৳${lossAmount.toFixed(2)})`;
      statusColor = "#dc2626"; // Red
    }
  }

  // ৩. Submit Handler
  const handleAssetSellSubmit = (e) => {
    e.preventDefault();

    if (!selectedAsset) {
      toast.error("Please select a product first!");
      return;
    }

    if (!sellingPrice || parseFloat(sellingPrice) < 0) {
      toast.error("Please enter a valid selling price!");
      return;
    }

    if (!selectedAccount) {
      toast.error("Please select a payment account!");
      return;
    }

    const chosenAccountObj = paymentAccounts.find(acc => acc.id === selectedAccount);

    Swal.fire({
      title: "Confirm Asset Sale?",
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.6;">
          <p><b>Product:</b> ${selectedAsset.productName}</p>
          <p><b>Invoice ID:</b> ${selectedAsset.invoiceId}</p>
          <p><b>Original Price:</b> ৳${originalCost}</p>
          <p><b>Current Value:</b> ৳${currentValue}</p>
          <hr />
          <p><b>Selling Price:</b> ৳${numericSellingPrice}</p>
          <p><b>Deposit Account:</b> <span style="color: #2563eb; font-weight: bold;">${chosenAccountObj?.name}</span></p>
          <p><b>Status:</b> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></p>
          <p><b>New Depreciation for DB:</b> <b style="color: #523bf7;">৳${liveUpdatedDepreciation.toFixed(2)}</b></p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#523bf7",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Confirm Sale!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // ব্যাকএন্ড ডাটাবেজে পাঠানোর মতো আপডেট Payload
        const updatedPayload = {
          assetId: selectedAsset.id,
          invoiceId: selectedAsset.invoiceId,
          productName: selectedAsset.productName,
          sellDate: sellDate,
          depositAccount: selectedAccount,
          depositAccountName: chosenAccountObj?.name,
          originalAmount: originalCost,
          sellingPrice: numericSellingPrice,
          oldDepreciation: currentDepreciation,
          newDepreciation: liveUpdatedDepreciation,
          profitOrLossAmount: Math.abs(diff),
        };

        console.log("Database Update Payload:", updatedPayload);

        toast.success("Asset sold successfully & Depreciation updated!");

        // রিসেট ফর্ম
        setSelectedAsset(null);
        setSellingPrice("");
        setSelectedAccount("");
      }
    });
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header */}
        <AssetSellHeader />

        <form onSubmit={handleAssetSellSubmit}>
          {/* Top Row: Sale Date */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#475569",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Sale Date
            </label>
            <input
              type="date"
              value={sellDate}
              onChange={(e) => setSellDate(e.target.value)}
              style={{
                width: "100%",
                padding: "9px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
              }}
            />
          </div>

          {/* Group, SubGroup & Dynamic Dropdown */}
          <AssetSelectDropDown
            availableAssets={availableAssets}
            selectedAsset={selectedAsset}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
          />

          {/* Product Details Display Section (নন-এডিটেবল কার্ড) */}
          {selectedAsset && (
            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "12px",
                }}
              >
                {/* Invoice ID */}
                <div>
                  <small style={{ color: "#64748b", fontWeight: "600" }}>
                    Invoice ID
                  </small>
                  <input
                    type="text"
                    value={selectedAsset.invoiceId}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#e2e8f0",
                      fontWeight: "600",
                    }}
                  />
                </div>

                {/* Product Name */}
                <div>
                  <small style={{ color: "#64748b", fontWeight: "600" }}>
                    Product Name
                  </small>
                  <input
                    type="text"
                    value={selectedAsset.productName}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#e2e8f0",
                      fontWeight: "600",
                    }}
                  />
                </div>

                {/* Original Price */}
                <div>
                  <small style={{ color: "#64748b", fontWeight: "600" }}>
                    Product Price (Original)
                  </small>
                  <input
                    type="text"
                    value={`৳ ${originalCost}`}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#e2e8f0",
                      fontWeight: "600",
                    }}
                  />
                </div>

                {/* Depreciation */}
                <div>
                  <small style={{ color: "#64748b", fontWeight: "600" }}>
                    Product Depreciation
                  </small>
                  <input
                    type="text"
                    value={`৳ ${currentDepreciation}`}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#e2e8f0",
                      fontWeight: "600",
                      color: "#ef4444",
                    }}
                  />
                </div>

                {/* Current Value */}
                <div>
                  <small style={{ color: "#64748b", fontWeight: "600" }}>
                    Current Value (Price - Dep.)
                  </small>
                  <input
                    type="text"
                    value={`৳ ${currentValue}`}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#dcfce7",
                      fontWeight: "700",
                      color: "#166534",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Grid Row for Selling Price & Deposit Account */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {/* Editable Selling Price Input */}
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#475569",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Selling Price (৳)
              </label>
              <input
                type="number"
                placeholder="Enter selling price"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              />
            </div>

            {/* Deposit Account / Payment Method Dropdown */}
            <div>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#475569",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Deposit Account / Payment Method
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <option value="">-- Select Payment Account --</option>
                {paymentAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Calculation Preview */}
          {selectedAsset && isSellingPriceValid && (
            <div
              style={{
                backgroundColor: "#f1f5f9",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "20px",
                borderLeft: `4px solid ${statusColor}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justify: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontWeight: "600",
                      display: "block",
                    }}
                  >
                    Sale Summary
                  </span>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: statusColor,
                    }}
                  >
                    {statusText}
                  </span>
                </div>

                <div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontWeight: "600",
                      display: "block",
                    }}
                  >
                    New Updated Depreciation (To DB)
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#523bf7",
                    }}
                  >
                    ৳ {liveUpdatedDepreciation.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#ef4444",
              color: "#ffffff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Confirm &amp; Sell Asset
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssetSell;