import {
  inputGroupStyle,
  inputStyle,
  labelStyle,
} from "../../../../services/styles";

const NoteInput = ({ value, onChange }) => (
  <div style={inputGroupStyle}>
    <label style={labelStyle}>Notes</label>
    <textarea
      placeholder="Enter expense details or reference..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows="3"
      style={{ ...inputStyle, resize: "vertical" }}
    />
  </div>
);

export default NoteInput;
