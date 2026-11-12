

const FinancialLiabilityTable = ({ data = [], loading }) => {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading pending liabilities...</div>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Invoice No</th>
            <th style={styles.th}>Supplier Name</th>
            <th style={styles.th}>Issue Date</th>
            <th style={styles.th}>Total Amount</th>
            <th style={styles.th}>Paid Amount</th>
            <th style={styles.th}>Due Amount</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => {
              const dueAmount = (row.totalAmount || 0) - (row.paidAmount || 0);
              const name = row.supplierName || row.clientName || 'N/A';

              return (
                <tr key={row.id || row.invoiceNo || index} style={styles.bodyRow}>
                  <td style={{ ...styles.td, fontWeight: 'bold' }}>{row.invoiceNo}</td>
                  <td style={styles.td}>{name}</td>
                  <td style={styles.td}>{formatDate(row.issueDate)}</td>
                  <td style={styles.td}>৳ {(row.totalAmount || 0).toLocaleString()}</td>
                  <td style={{ ...styles.td, color: '#198754', fontWeight: '500' }}>
                    ৳ {(row.paidAmount || 0).toLocaleString()}
                  </td>
                  <td style={{ ...styles.td, fontWeight: 'bold', color: '#dc3545' }}>
                    ৳ {dueAmount.toLocaleString()}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" style={{ ...styles.td, textAlign: 'center', padding: '24px' }}>
                No pending liabilities found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontFamily: 'sans-serif',
  },
  headerRow: {
    backgroundColor: '#343a40',
    color: '#ffffff',
  },
  th: {
    padding: '12px 14px',
    border: '1px solid #454d55',
    fontWeight: '600',
    fontSize: '14px',
  },
  bodyRow: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '12px 14px',
    border: '1px solid #dee2e6',
    color: '#212529',
    fontSize: '14px',
  },
};

export default FinancialLiabilityTable;