
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AssetFilter = ({
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedGroup,
    setSelectedGroup,
    selectedSubGroup,
    setSelectedSubGroup,
    groups = [],
    subGroups = [],
    onReset,
}) => {
    return (
        <div style={styles.filterContainer}>
            {/* From Date */}
            <div style={styles.fieldGroup}>
                <label style={styles.label}>From Date:</label>
                <DatePicker
                    selected={fromDate ? new Date(fromDate) : null}
                    onChange={(date) => setFromDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    style={styles.input}
                    customInput={<input style={styles.input} />}
                />
            </div>

            {/* To Date */}
            <div style={styles.fieldGroup}>
                <label style={styles.label}>To Date:</label>
                <DatePicker
                    selected={toDate ? new Date(toDate) : null}
                    onChange={(date) => setToDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    customInput={<input style={styles.input} />}
                />
            </div>

            {/* Group Filter */}
            <div style={styles.fieldGroup}>
                <label style={styles.label}>Group:</label>
                <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    style={styles.select}
                >
                    <option value="">All Groups</option>
                    {groups.map((group, idx) => (
                        <option key={idx} value={group}>
                            {group}
                        </option>
                    ))}
                </select>
            </div>

            {/* Sub-Group Filter */}
            <div style={styles.fieldGroup}>
                <label style={styles.label}>Sub Group:</label>
                <select
                    value={selectedSubGroup}
                    onChange={(e) => setSelectedSubGroup(e.target.value)}
                    style={styles.select}
                >
                    <option value="">All Sub Groups</option>
                    {subGroups.map((subGroup, idx) => (
                        <option key={idx} value={subGroup}>
                            {subGroup}
                        </option>
                    ))}
                </select>
            </div>

            {/* Reset Button */}
            <div style={{ marginTop: '18px' }}>
                <button onClick={onReset} style={styles.resetButton}>
                    Reset Filters
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
        marginBottom: '24px',
        backgroundColor: '#f8f9fa',
        padding: '20px',
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
    select: {
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        minWidth: '160px',
        outline: 'none',
        cursor: 'pointer',
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

export default AssetFilter;