// AssetSellHeader.jsx
import { useNavigate } from "react-router";

const AssetSellHeader = () => {
  const navigate = useNavigate();

  const buttonBaseStyle = {
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "22px", color: "#1e293b" }}>Sell Asset</h2>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>Filter, select and process asset sales</p>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={() => navigate("/accounts/asset/asset-list")}
          style={{ ...buttonBaseStyle, backgroundColor: "#64748b" }}
        >
          📋 Asset List
        </button>
        <button
          type="button"
          onClick={() => navigate("/accounts/asset/asset-buy")}
          style={{ ...buttonBaseStyle, backgroundColor: "#523bf7" }}
        >
          + Buy Asset
        </button>
      </div>
    </div>
  );
};

export default AssetSellHeader;