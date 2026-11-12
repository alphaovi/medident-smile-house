

const AssetTable = ({ data, loading }) => {
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading assets data...</div>;
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.headerRow}>
                        <th style={styles.th}>Buying Date</th>
                        <th style={styles.th}>Product Name</th>
                        <th style={styles.th}>Group</th>
                        <th style={styles.th}>Sub Group</th>
                        <th style={styles.th}>Buying Price</th>
                        <th style={styles.th}>Monthly Dep.</th>
                        <th style={styles.th}>Accumulated Dep.</th>
                        <th style={styles.th}>Current Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row) => (
                            <tr key={row.id} style={styles.bodyRow}>
                                <td style={styles.td}>{row.buyingDate}</td>
                                <td style={styles.td}>{row.productName}</td>
                                <td style={styles.td}>{row.group}</td>
                                <td style={styles.td}>{row.subGroup}</td>
                                <td style={styles.td}>৳ {row.buyingPrice?.toLocaleString()}</td>
                                <td style={styles.td}>৳ {row.monthlyDepreciation?.toLocaleString()}</td>
                                <td style={styles.td}>৳ {row.accumulatedDepreciation?.toLocaleString()}</td>
                                <td style={styles.td}>৳ {row.currentValue?.toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ ...styles.td, textAlign: 'center', padding: '24px' }}>
                                No assets found matching the selected filter criteria.
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
        backgroundColor: '#007bff',
        color: '#ffffff',
    },
    th: {
        padding: '12px 14px',
        border: '1px solid #0056b3',
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

export default AssetTable;