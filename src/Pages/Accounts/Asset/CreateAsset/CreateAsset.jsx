// CreateAsset.jsx
import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import DateInput from "./DataInput";
import FixedTypeInput from "./FixedTypeInput";
import AssetRow from "./AssetRow";

const CreateAsset = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Multiple Asset Items State
  const [assetItems, setAssetItems] = useState([
    { group: "", subGroup: "", name: "", amount: "", depreciation: "" }
  ]);

  // Handle Dynamic Input Change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...assetItems];
    
    // Group পরিবর্তন হলে SubGroup রিসেট হবে
    if (field === "group") {
      updatedItems[index]["subGroup"] = "";
    }
    
    updatedItems[index][field] = value;
    setAssetItems(updatedItems);
  };

  // Plus button click: Add new asset row
  const handleAddRow = () => {
    setAssetItems((prev) => [
      ...prev,
      { group: "", subGroup: "", name: "", amount: "", depreciation: "" }
    ]);
  };

  // Subtotal Calculation (Depreciation বাদ দিয়ে শুধুমাত্র Amount এর Subtotal)
  const subTotalAmount = assetItems.reduce((acc, item) => {
    const val = parseFloat(item.amount);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  // Submit Handler with SweetAlert2 and Toastify
  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to save ${assetItems.length} asset item(s) with total ৳${subTotalAmount.toFixed(2)}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#523bf7",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Save Assets!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Data Payload Output
        console.log("Submitted Assets:", { date, type: "Buy", items: assetItems, subTotal: subTotalAmount });

        toast.success("Assets created successfully! 🎉", {
          position: "top-right",
          autoClose: 3000,
        });

        // Reset Form
        setAssetItems([{ group: "", subGroup: "", name: "", amount: "", depreciation: "" }]);
      }
    });
  };

  // Common Responsive Action Button Style
  const actionButtonStyle = {
    color: "#ffffff",
    border: "none",
    padding: "8px 18px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        
        {/* Responsive Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", color: "#1e293b" }}>Create New Asset</h2>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>Fill in the details to add assets</p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/accounts/asset/asset-sell")}
              style={{ ...actionButtonStyle, backgroundColor: "#ef4444" }}
            >
              🏷️ Asset Sell
            </button>

            <button
              type="button"
              onClick={() => navigate("/accounts/asset/asset-list")}
              style={{ ...actionButtonStyle, backgroundColor: "#523bf7" }}
            >
              📋 Asset List
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Top Row: Date & Fixed Buy Type */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
            <DateInput value={date} onChange={setDate} />
            <FixedTypeInput />
          </div>

          {/* Dynamic Asset Items List */}
          <div>
            {assetItems.map((item, index) => (
              <AssetRow
                key={index}
                index={index}
                item={item}
                onChange={handleItemChange}
                onAddRow={handleAddRow}
                showAddButton={index === assetItems.length - 1} // শুধুমাত্র লাস্ট রো-তে প্লাস বাটন থাকবে
              />
            ))}
          </div>

          {/* Right Corner Subtotal Section */}
          <div style={{ display: "flex", justifyContent: "flex-end", margin: "16px 0" }}>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", backgroundColor: "#f1f5f9", padding: "8px 16px", borderRadius: "8px" }}>
              Subtotal: ৳{subTotalAmount.toFixed(2)}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: "100%",
              backgroundColor: "#523bf7",
              color: "#ffffff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Save Asset
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAsset;