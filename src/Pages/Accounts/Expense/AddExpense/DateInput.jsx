import { useRef } from "react";
import {
  customInputContainerStyle,
  dateInputStyle,
  inputGroupStyle,
  labelStyle,
} from "../../../../services/styles";

const DateInput = ({ value, onChange }) => {
  const dateInputRef = useRef(null);

  const handleContainerClick = () => {
    if (dateInputRef.current) {
      if ("showPicker" in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div style={inputGroupStyle}>
      <label style={labelStyle}>Date</label>
      <div style={customInputContainerStyle} onClick={handleContainerClick}>
        <input
          ref={dateInputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          style={dateInputStyle}
        />
      </div>
    </div>
  );
};

export default DateInput;
