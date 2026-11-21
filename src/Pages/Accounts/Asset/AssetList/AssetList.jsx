// AssetList.jsx
import { useState, useEffect, useMemo } from "react";
import AssetListFilter from "./AssetListFilter";
import AssetListTable from "./AssetListTable";
import EditAssetModal from "./EditAssetModal";

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedHead, setSelectedHead] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [selectedAssetToEdit, setSelectedAssetToEdit] = useState(null);

  // Dummy Initial Data
  useEffect(() => {
    setTimeout(() => {
      const initialData = [
        {
          id: "AST-201",
          date: "2026-08-28",
          assetHead: "Electronics",
          assetSubHead: "Computers",
          paymentMethod: "City Bank",
          amount: 85000,
          note: "Dell XPS 15 laptop for UI/UX Designer.",
          status: "Bought", // Locked state
        },
        {
          id: "AST-202",
          date: "2026-08-29",
          assetHead: "Furniture",
          assetSubHead: "Chairs",
          paymentMethod: "Petty Cash",
          amount: 12000,
          note: "Ergonomic mesh chairs for executive desk.",
          status: "Pending", // Editable state
        },
        {
          id: "AST-203",
          date: "2026-08-30",
          assetHead: "Electronics",
          assetSubHead: "Printers",
          paymentMethod: "Bkash",
          amount: 5000,
          note: "Old laser printer sold to scrap market.",
          status: "Sold", // Locked state
        },
      ];
      setAssets(initialData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter Head Options
  const headOptions = useMemo(() => {
    return Array.from(new Set(assets.map((a) => a.assetHead).filter(Boolean)));
  }, [assets]);

  // Handle Dynamic Status Change
  const handleStatusChange = (assetId, newStatus) => {
    setAssets((prev) =>
      prev.map((item) =>
        item.id === assetId ? { ...item, status: newStatus } : item
      )
    );
  };

  // Save Modal Data
  const handleSaveEditedData = (updatedAsset) => {
    setAssets((prev) =>
      prev.map((item) =>
        item.id === updatedAsset.id ? { ...updatedAsset } : item
      )
    );
    setSelectedAssetToEdit(null);
  };

  // Filter Computation
  const filteredAssets = useMemo(() => {
    return assets.filter((item) => {
      const matchesHead =
        selectedHead === "ALL" || item.assetHead === selectedHead;
      const matchesDate =
        (!fromDate || item.date >= fromDate) && (!toDate || item.date <= toDate);
      const matchesSearch = Object.values(item).some((val) =>
        String(val || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      return matchesHead && matchesDate && matchesSearch;
    });
  }, [assets, selectedHead, fromDate, toDate, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Asset Management List</h1>
          <p className="text-sm text-slate-500">Track, approve, print, and edit assets</p>
        </div>

        {/* Filter Section */}
        <AssetListFilter
          selectedHead={selectedHead}
          setSelectedHead={setSelectedHead}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          headOptions={headOptions}
        />

        {/* Main Data Table */}
        {loading ? (
          <div className="bg-white p-12 text-center text-slate-500 font-bold rounded-2xl border border-slate-200">
            Loading Assets...
          </div>
        ) : (
          <AssetListTable
            assets={filteredAssets}
            onStatusChange={handleStatusChange}
            onEditClick={(asset) => setSelectedAssetToEdit(asset)}
          />
        )}

        {/* Edit Asset Modal */}
        {selectedAssetToEdit && (
          <EditAssetModal
            asset={selectedAssetToEdit}
            onClose={() => setSelectedAssetToEdit(null)}
            onSave={handleSaveEditedData}
          />
        )}
      </div>
    </div>
  );
};

export default AssetList;