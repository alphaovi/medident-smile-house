import {
  inputGroupStyle,
  inputStyle,
  labelStyle,
} from "../../../../services/styles";

const GroupSelect = ({ options, selectedGroup, onSelectGroup }) => (
  <div style={inputGroupStyle}>
    <label style={labelStyle}>Expense Group (Parent)</label>
    <select
      value={selectedGroup}
      onChange={(e) => onSelectGroup(e.target.value)}
      required
      style={inputStyle}
    >
      <option value="">-- Select Group --</option>
      {options.map((group) => (
        <option key={group} value={group}>
          {group}
        </option>
      ))}
    </select>
  </div>
);

export default GroupSelect;
