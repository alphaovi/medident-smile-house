import  { useState, useEffect } from 'react';
import AssetFilter from './AssetFilter';
import AssetTable from './AssetTable';

const FinancialAssetReports = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedSubGroup, setSelectedSubGroup] = useState('');

    // Fetching from public/companyAsset.json
    useEffect(() => {
        fetch('/companyAsset.json')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                return res.json();
            })
            .then((data) => {
                setAssets(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching asset data:', err);
                setLoading(false);
            });
    }, []);

    // Extract unique groups and subGroups
    const groups = [...new Set(assets.map((item) => item.group))].filter(Boolean);
    const subGroups = [...new Set(assets.map((item) => item.subGroup))].filter(Boolean);

    // Filter Logic by Buying Date Range, Group & SubGroup
    const filteredData = assets.filter((item) => {
        const itemDate = item.buyingDate ? new Date(item.buyingDate) : null;
        const start = fromDate ? new Date(fromDate) : null;
        const end = toDate ? new Date(toDate) : null;

        const matchesFromDate = !start || (itemDate && itemDate >= start);
        const matchesToDate = !end || (itemDate && itemDate <= end);
        const matchesGroup = !selectedGroup || item.group === selectedGroup;
        const matchesSubGroup = !selectedSubGroup || item.subGroup === selectedSubGroup;

        return matchesFromDate && matchesToDate && matchesGroup && matchesSubGroup;
    });

    const handleReset = () => {
        setFromDate('');
        setToDate('');
        setSelectedGroup('');
        setSelectedSubGroup('');
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Financial Asset Reports</h2>

            <AssetFilter
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                selectedSubGroup={selectedSubGroup}
                setSelectedSubGroup={setSelectedSubGroup}
                groups={groups}
                subGroups={subGroups}
                onReset={handleReset}
            />

            <AssetTable data={filteredData} loading={loading} />
        </div>
    );
};

export default FinancialAssetReports;