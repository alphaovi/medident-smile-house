import {
  currencySymbolStyle,
  inputGroupStyle,
  inputStyle,
  labelStyle,
} from "../../../../services/styles";

const AmountInput = ({ value, onChange }) => (
  <div style={inputGroupStyle}>
    <label style={labelStyle}>Amount</label>
    <div style={{ position: "relative" }}>
      <span style={currencySymbolStyle}>৳</span>
      <input
        type="number"
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        style={{ ...inputStyle, paddingLeft: "30px" }}
      />
    </div>
  </div>
);

export default AmountInput;
