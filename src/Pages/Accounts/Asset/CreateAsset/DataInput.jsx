
const DateInput = ({ value, onChange }) => {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>Date</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.target.showPicker()}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          cursor: "pointer",
          outline: "none"
        }}
      />
    </div>
  );
};

export default DateInput;