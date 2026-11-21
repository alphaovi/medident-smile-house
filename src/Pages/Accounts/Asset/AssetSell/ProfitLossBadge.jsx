// ProfitLossBadge.jsx
const ProfitLossBadge = ({ bookValue, sellPrice }) => {
  if (!sellPrice || isNaN(sellPrice)) return null;

  const numericSell = parseFloat(sellPrice);
  const difference = numericSell - bookValue;

  const isProfit = difference > 0;
  const isLoss = difference < 0;

  if (difference === 0) {
    return (
      <div style={{ padding: "8px 14px", borderRadius: "8px", backgroundColor: "#f1f5f9", color: "#475569", fontWeight: "600", fontSize: "13px" }}>
        No Profit / No Loss
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 16px",
      borderRadius: "8px",
      backgroundColor: isProfit ? "#ecfdf5" : "#fef2f2",
      border: `1px solid ${isProfit ? "#a7f3d0" : "#fecaca"}`,
      color: isProfit ? "#047857" : "#dc2626",
      fontWeight: "700",
      fontSize: "14px"
    }}>
      <span>{isProfit ? "📈 Profit:" : "📉 Loss:"}</span>
      <span>৳{Math.abs(difference).toLocaleString()}</span>
    </div>
  );
};

export default ProfitLossBadge;