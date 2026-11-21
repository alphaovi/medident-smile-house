import {
  inputGroupStyle,
  inputStyle,
  labelStyle,
} from "../../../../services/styles";

const PaidFromSelect = ({ banks, selectedBank, onSelectBank }) => (
  <div style={inputGroupStyle}>
    <label style={labelStyle}>Paid From</label>
    <select
      value={selectedBank}
      onChange={(e) => onSelectBank(e.target.value)}
      required
      style={inputStyle}
    >
      <option value="">-- Select Payment Source --</option>
      {banks.map((bank, index) => (
        <option key={index} value={bank}>
          {bank}
        </option>
      ))}
    </select>
  </div>
);

export default PaidFromSelect;
