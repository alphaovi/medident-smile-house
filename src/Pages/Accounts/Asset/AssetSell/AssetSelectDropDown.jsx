// AssetSelectDropDown.jsx
import { useState, useMemo } from "react";

const AssetSelectDropDown = ({
  availableAssets = [],
  selectedAsset,
  onSelectAsset,
}) => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSubGroup, setSelectedSubGroup] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // ১. ইউনিক Group লিস্ট বের করা
  const groups = useMemo(() => {
    return [...new Set(availableAssets.map((item) => item.group))].filter(Boolean);
  }, [availableAssets]);

  // ২. সিলেক্টেড Group অনুযায়ী SubGroup ফিল্টার করা
  const subGroups = useMemo(() => {
    if (!selectedGroup) return [];
    return [
      ...new Set(
        availableAssets
          .filter((item) => item.group === selectedGroup)
          .map((item) => item.subGroup)
      ),
    ].filter(Boolean);
  }, [availableAssets, selectedGroup]);

  // ৩. Group, SubGroup এবং Current Value > 0 ফিল্টার করে প্রোডাক্ট টেবিল রেডি করা
  const filteredAssets = useMemo(() => {
    if (!selectedGroup || !selectedSubGroup) return [];
    return availableAssets.filter((asset) => {
      const original = parseFloat(asset.originalAmount || 0);
      const dep = parseFloat(asset.depreciation || 0);
      const currentValue = original - dep;

      return (
        asset.group === selectedGroup &&
        asset.subGroup === selectedSubGroup &&
        currentValue > 0 // ০ বা তার কম কারেন্ট ভ্যালুর প্রোডাক্ট ড্রপডাউনে দেখাবে না
      );
    });
  }, [availableAssets, selectedGroup, selectedSubGroup]);

  return (
    <div style={{ width: "100%", marginBottom: "20px" }}>
      {/* Group and SubGroup Selectors */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
        {/* Select Group */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>
            Select Group
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => {
              setSelectedGroup(e.target.value);
              setSelectedSubGroup("");
              onSelectAsset(null);
            }}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
          >
            <option value="">-- Select Group --</option>
            {groups.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Select SubGroup */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>
            Select Sub Group
          </label>
          <select
            disabled={!selectedGroup}
            value={selectedSubGroup}
            onChange={(e) => {
              setSelectedSubGroup(e.target.value);
              onSelectAsset(null);
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: !selectedGroup ? "#f1f5f9" : "#ffffff",
              fontSize: "13px"
            }}
          >
            <option value="">-- Select Sub Group --</option>
            {subGroups.map((sg, idx) => (
              <option key={idx} value={sg}>{sg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Dropdown Popover Table */}
      <div style={{ position: "relative" }}>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "4px" }}>
          Product Name & Info
        </label>
        <button
          type="button"
          disabled={!selectedSubGroup}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: "100%",
            padding: "10px",
            textAlign: "left",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            backgroundColor: !selectedSubGroup ? "#f1f5f9" : "#ffffff",
            cursor: !selectedSubGroup ? "not-allowed" : "pointer",
            fontWeight: "500",
            fontSize: "13px",
          }}
        >
          {selectedAsset
            ? `${selectedAsset.productName} (${selectedAsset.invoiceId})`
            : "-- Select Product from Table --"}
        </button>

        {isOpen && selectedSubGroup && (
          <div
            style={{
              position: "absolute",
              top: "105%",
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              zIndex: 50,
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "8px", textAlign: "left" }}>Invoice ID</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Product Name</th>
                  <th style={{ padding: "8px", textAlign: "right" }}>Original Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr
                      key={asset.invoiceId}
                      onClick={() => {
                        onSelectAsset(asset);
                        setIsOpen(false);
                      }}
                      style={{ cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ padding: "8px", color: "#523bf7", fontWeight: "600" }}>{asset.invoiceId}</td>
                      <td style={{ padding: "8px", color: "#334155" }}>{asset.productName}</td>
                      <td style={{ padding: "8px", textAlign: "right", fontWeight: "600" }}>৳{asset.originalAmount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ padding: "12px", textAlign: "center", color: "#94a3b8" }}>
                      No available products (Current Value &gt; 0) found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetSelectDropDown;