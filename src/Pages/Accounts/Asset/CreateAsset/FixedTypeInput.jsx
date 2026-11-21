// FixedTypeInput.jsx
const FixedTypeInput = () => {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>Transaction Type</label>
      <input
        type="text"
        value="Buy"
        readOnly
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          backgroundColor: "#f1f5f9",
          color: "#64748b",
          fontWeight: "600",
          outline: "none"
        }}
      />
    </div>
  );
};

export default FixedTypeInput;