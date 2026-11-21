// AssetRow.jsx
import { assetCategories } from "../../../../services/assetData";

const AssetRow = ({ item, index, onChange, onAddRow, showAddButton }) => {
  const availableSubGroups = item.group ? assetCategories[item.group] || [] : [];

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      alignItems: "flex-end",
      padding: "12px",
      backgroundColor: "#f8fafc",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      marginBottom: "12px"
    }}>
      {/* Group Select */}
      <div style={{ flex: 1.2 }}>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Group</label>
        <select
          value={item.group}
          onChange={(e) => onChange(index, "group", e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
        >
          <option value="">Select Group</option>
          {Object.keys(assetCategories).map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      {/* Sub Group Select */}
      <div style={{ flex: 1.2 }}>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Sub Group</label>
        <select
          value={item.subGroup}
          disabled={!item.group}
          onChange={(e) => onChange(index, "subGroup", e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
        >
          <option value="">Select Sub Group</option>
          {availableSubGroups.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      {/* Asset Name Field */}
      <div style={{ flex: 1.5 }}>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Asset Name</label>
        <input
          type="text"
          placeholder="e.g. MacBook Pro M3"
          value={item.name}
          onChange={(e) => onChange(index, "name", e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
        />
      </div>

      {/* Amount Field */}
      <div style={{ flex: 1 }}>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Amount (৳)</label>
        <input
          type="number"
          placeholder="0.00"
          value={item.amount}
          onChange={(e) => onChange(index, "amount", e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
        />
      </div>

      {/* Depreciation Field */}
      <div style={{ flex: 1 }}>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Depreciation (Monthly)</label>
        <input
          type="number"
          placeholder="0.00"
          value={item.depreciation}
          onChange={(e) => onChange(index, "depreciation", e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
        />
      </div>

      {/* Plus (+) Button to Add New Item */}
      {showAddButton && (
        <button
          type="button"
          onClick={onAddRow}
          style={{
            backgroundColor: "#523bf7",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            width: "36px",
            height: "36px",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          +
        </button>
      )}
    </div>
  );
};

export default AssetRow;