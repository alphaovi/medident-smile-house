import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Store, Search, ChevronRight, Loader2 } from "lucide-react";
import ProductTable from "./ProductTable";
import AddProductFormModal from "./AddProductFormModal";
import StoreProductModal from "./StoreProduct/StoreProductModal";

const AddProduct = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(10);

  // States loaded via useEffect
  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial dataset from public directory
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, groupsRes] = await Promise.all([
          fetch("/products.json"),
          fetch("/productsGroupSubgroup.json"),
        ]);

        const productsData = await productsRes.json();
        const groupsData = await groupsRes.json();

        setProducts(productsData);
        setGroups(groupsData);
      } catch (error) {
        console.error("Failed fetching JSON datasets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle adding new single product
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Handle batch store purchases
  const handleSaveStoreProduct = (purchaseData) => {
    const updatedProducts = [...products];

    purchaseData.purchasedItems.forEach((item) => {
      const existingIndex = updatedProducts.findIndex((p) => p.productId === item.productId);
      if (existingIndex !== -1) {
        updatedProducts[existingIndex] = {
          ...updatedProducts[existingIndex],
          quantity: updatedProducts[existingIndex].quantity + item.quantity,
          purchasePrice: Math.round(item.finalUnitBuyingPrice),
        };
      }
    });

    setProducts(updatedProducts);
  };

  // Frontend Delete handler
  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.productId !== productId));
  };

  // Printable Memo & Invoice Document Generator
  const handlePrintProduct = (product) => {
    const totalValue = (product.quantity || 0) * (product.unitPrice || 0);
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MEDIDENT - Product Statement</title>
          <style>
            @page { size: auto; margin: 20mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 0; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; }
            
            /* Company Header */
            .company-header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 25px; }
            .company-name { font-size: 32px; font-weight: 800; color: #0284c7; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
            .company-tagline { font-size: 12px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }

            /* Details Section */
            .details-container { display: flex; justify-content: space-between; margin-bottom: 25px; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 13px; }
            .details-column p { margin: 4px 0; }
            .details-column strong { color: #334155; }

            /* Table Style */
            .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .data-table th { background-color: #f1f5f9; color: #334155; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
            .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }

            /* Total Calculation Row */
            .total-row td { font-weight: bold; font-size: 15px; background-color: #f8fafc; border-top: 2px solid #334155; color: #0f172a; }

            /* Footer Stamp */
            .footer-stamp { margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
            .signature-line { border-top: 1px solid #cbd5e1; width: 180px; text-align: center; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            
            <!-- Company Title -->
            <div class="company-header">
              <h1 class="company-name">MEDIDENT</h1>
              <div class="company-tagline">Dental Materials & Equipment Supplier</div>
            </div>

            <!-- Product & Supplier Meta Info -->
            <div class="details-container">
              <div class="details-column">
                <p><strong>Product Category:</strong> ${product.productGroup || "N/A"}</p>
                <p><strong>Sub Category:</strong> ${product.productSubGroup || "N/A"}</p>
                <p><strong>Status:</strong> ${product.isActive ? "Active Stock" : "Inactive"}</p>
              </div>
              <div class="details-column" style="text-align: right;">
                <p><strong>Supplier Name:</strong> ${product.supplierName || "Dental Source BD"}</p>
                <p><strong>Supplier Code:</strong> ${product.supplierId || "SUP-001"}</p>
                <p><strong>Printed Date:</strong> ${currentDate}</p>
              </div>
            </div>

            <h3 style="font-size: 15px; color: #334155; margin-bottom: 10px; text-transform: uppercase;">Product Stock Breakdown</h3>

            <!-- Data Table -->
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product Code</th>
                  <th>Product Name</th>
                  <th>Supplier</th>
                  <th class="text-center">Stock Qty</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${product.productId}</strong></td>
                  <td>${product.productName}</td>
                  <td>${product.supplierName || "Dental Source BD"}</td>
                  <td class="text-center">${product.quantity} ${product.selectedUnit || ""}</td>
                  <td class="text-right">৳ ${Number(product.unitPrice || 0).toLocaleString()}</td>
                  <td class="text-right">৳ ${totalValue.toLocaleString()}</td>
                </tr>

                <!-- Total Summary Row -->
                <tr class="total-row">
                  <td colspan="3">TOTAL INVENTORY VALUE</td>
                  <td class="text-center">${product.quantity} ${product.selectedUnit || ""}</td>
                  <td class="text-right">-</td>
                  <td class="text-right">৳ ${totalValue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <!-- Signatures -->
            <div class="footer-stamp">
              <div class="signature-line">Prepared By</div>
              <div class="signature-line">Authorized Signature</div>
            </div>

          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Products Management</h1>
        <div className="flex items-center gap-2 text-xs text-base-content/70">
          <span>Dashboard</span>
          <ChevronRight className="size-3" />
          <span className="font-semibold text-primary font-mono">Products</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
        {/* Top Control Bar */}
        <div className="p-5 border-b border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Products List</h2>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStoreModalOpen(true)}
              className="btn text-white bg-teal-600 hover:bg-teal-700 btn-sm gap-2 border-0"
            >
              <Store className="size-4" /> Store Product
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm gap-2"
            >
              <Plus className="size-4" /> New Product
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-5 border-b border-base-200 bg-base-200/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Show</span>
            <select
              value={entries}
              onChange={(e) => setEntries(Number(e.target.value))}
              className="select select-bordered select-xs w-20"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-sm w-full pl-9"
            />
            <Search className="size-4 text-base-content/50 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Loading / Table View */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-base-content/60">
            <Loader2 className="size-8 animate-spin text-primary mb-2" />
            <p className="text-sm">Loading dataset...</p>
          </div>
        ) : (
          <ProductTable
            products={products}
            searchTerm={searchTerm}
            entries={entries}
            onDeleteProduct={handleDeleteProduct}
            onPrintProduct={handlePrintProduct}
          />
        )}
      </div>

      {/* Modals */}
      <AddProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
        groups={groups}
      />

      <StoreProductModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        products={products}
        onSaveStoreProduct={handleSaveStoreProduct}
      />
    </motion.div>
  );
};

export default AddProduct;