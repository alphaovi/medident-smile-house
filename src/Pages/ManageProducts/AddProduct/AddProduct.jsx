import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, FolderPlus, Search, ChevronRight, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import ProductTable from "./ProductTable";
import AddProductFormModal from "./AddProductFormModal";
import EditProductModal from "./EditProductModal";
import ManageGroupModal from "./ManageGroupSubgroup/ManageGroupModal"; // নতুন মডাল ইম্পোর্ট করা হলো

const AddProduct = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false); // গ্রুপ ম্যানেজ মডালের স্টেট
  const [editingProduct, setEditingProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(10);

  const [products, setProducts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) => {
      const updatedList = prev.map((item) => {
        const itemId = item.productId || item.code || item.id || item._id;
        const updatedId =
          updatedProduct.productId ||
          updatedProduct.code ||
          updatedProduct.id ||
          updatedProduct._id;

        if (String(itemId) === String(updatedId)) {
          return { ...item, ...updatedProduct };
        }
        return item;
      });
      return updatedList;
    });
  };

  // Status Toggle Function
  const handleToggleStatus = (targetProduct) => {
    const targetId =
      targetProduct.productId || targetProduct.code || targetProduct.id;

    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const pId = p.productId || p.code || p.id;
        if (pId === targetId) {
          const currentStatus = p.isActive !== undefined ? p.isActive : true;
          return { ...p, isActive: !currentStatus };
        }
        return p;
      }),
    );
  };

  // Add Group / Subgroup click handler
  const handleAddGroupSubgroup = () => {
    setIsGroupModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: "Delete",
      text: "Are you sure you want to delete this item?",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: false,
      customClass: {
        popup:
          "rounded-lg p-5 max-w-sm text-left font-sans shadow-xl border border-gray-200",
        title:
          "text-xl font-normal text-gray-800 text-left border-b border-gray-200 pb-3 mb-4",
        htmlContainer: "text-gray-600 text-base text-left my-4 font-normal",
        actions:
          "flex justify-end gap-2 border-t border-gray-200 pt-3 mt-4 w-full",
        confirmButton:
          "bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded border-0 text-sm",
        cancelButton:
          "bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded border border-gray-300 text-sm",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setProducts((prev) =>
          prev.filter((p) => (p.productId || p.id || p.code) !== productId),
        );
      }
    });
  };

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
            .company-header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 25px; }
            .company-name { font-size: 32px; font-weight: 800; color: #0284c7; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
            .company-tagline { font-size: 12px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
            .details-container { display: flex; justify-content: space-between; margin-bottom: 25px; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 13px; }
            .details-column p { margin: 4px 0; }
            .details-column strong { color: #334155; }
            .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .data-table th { background-color: #f1f5f9; color: #334155; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #cbd5e1; }
            .data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-row td { font-weight: bold; font-size: 15px; background-color: #f8fafc; border-top: 2px solid #334155; color: #0f172a; }
            .footer-stamp { margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
            .signature-line { border-top: 1px solid #cbd5e1; width: 180px; text-align: center; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="company-header">
              <h1 class="company-name">MEDIDENT</h1>
              <div class="company-tagline">Dental Materials & Equipment Supplier</div>
            </div>
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
                  <td><strong>${product.productId || product.code || product.id}</strong></td>
                  <td>${product.productName || product.name}</td>
                  <td>${product.supplierName || "Dental Source BD"}</td>
                  <td class="text-center">${product.quantity || product.stock} ${product.selectedUnit || product.unit || ""}</td>
                  <td class="text-right">৳ ${Number(product.unitPrice || product.price || 0).toLocaleString()}</td>
                  <td class="text-right">৳ ${totalValue.toLocaleString()}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3">TOTAL INVENTORY VALUE</td>
                  <td class="text-center">${product.quantity || product.stock} ${product.selectedUnit || product.unit || ""}</td>
                  <td class="text-right">-</td>
                  <td class="text-right">৳ ${totalValue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Products List</h2>

          <div className="flex items-center gap-3">
            {/* Add Group / Subgroup Button */}
            <button
              onClick={handleAddGroupSubgroup}
              className="btn text-white bg-teal-600 hover:bg-teal-700 btn-sm gap-2 border-0"
            >
              <FolderPlus className="size-4" /> Add Group / Subgroup
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm gap-2"
            >
              <Plus className="size-4" /> New Product
            </button>
          </div>
        </div>

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
            onEditProduct={handleEditProduct}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      <AddProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
        groups={groups}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={editingProduct}
        groups={groups}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* Group & Subgroup Management Modal */}
      <ManageGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        groups={groups}
        setGroups={setGroups}
      />
    </motion.div>
  );
};

export default AddProduct;