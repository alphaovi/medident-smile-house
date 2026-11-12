
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FinancialLiabilityFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange, onReset }) => {
  return (
    <div style={styles.filterContainer}>
      {/* From Date */}
      <div style={styles.fieldGroup}>
        <label style={styles.label}>From Due Date:</label>
        <DatePicker
          selected={fromDate}
          onChange={(date) => onFromDateChange(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          customInput={<input style={styles.input} />}
        />
      </div>

      {/* To Date */}
      <div style={styles.fieldGroup}>
        <label style={styles.label}>To Due Date:</label>
        <DatePicker
          selected={toDate}
          onChange={(date) => onToDateChange(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          customInput={<input style={styles.input} />}
        />
      </div>

      {/* Reset Button */}
      <div style={{ marginTop: '18px' }}>
        <button onClick={onReset} style={styles.resetButton}>
          Reset Filter
        </button>
      </div>
    </div>
  );
};

const styles = {
  filterContainer: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: '#f8f9fa',
    padding: '16px 20px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '4px',
    color: '#495057',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    outline: 'none',
    cursor: 'pointer',
    width: '130px',
  },
  resetButton: {
    padding: '9px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#6c757d',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default FinancialLiabilityFilter;