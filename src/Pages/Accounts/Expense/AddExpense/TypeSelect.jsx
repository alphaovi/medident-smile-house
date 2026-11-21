import {
  inputGroupStyle,
  inputStyle,
  labelStyle,
} from "../../../../services/styles";

const TypeSelect = ({ options, selectedType, onSelectType, isDisabled }) => (
  <div style={inputGroupStyle}>
    <label style={labelStyle}>Expense Type (Child)</label>
    <select
      value={selectedType}
      onChange={(e) => onSelectType(e.target.value)}
      disabled={isDisabled}
      required
      style={{
        ...inputStyle,
        backgroundColor: isDisabled ? "#f1f5f9" : "#ffffff",
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      <option value="">
        {isDisabled ? "Select Group First" : "-- Select Type --"}
      </option>
      {options.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  </div>
);

export default TypeSelect;
