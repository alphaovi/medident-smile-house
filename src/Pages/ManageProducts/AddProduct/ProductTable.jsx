import { motion } from "framer-motion";
import { Edit, Trash2, Printer, Image as ImageIcon } from "lucide-react";

// Product List Table with Print and Edit Action functionality
const ProductTable = ({ 
  products, 
  searchTerm, 
  entries, 
  onDeleteProduct, 
  onPrintProduct, 
  onEditProduct // 👈 onEditProduct prop যুক্ত করা হয়েছে
}) => {
  // Filter product by search keyword
  const filteredProducts = products.filter(
    (p) =>
      (p.productName || p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.productId || p.code || p.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.productGroup || p.group || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="table w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="bg-base-200/80 text-base-content text-xs uppercase font-bold border-b border-base-300">
            <th className="py-3 px-4">#SN.</th>
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4">Code</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Group / SubGroup</th>
            <th className="py-3 px-4">Unit</th>
            <th className="py-3 px-4">P-Price</th>
            <th className="py-3 px-4">T.P-Price</th>
            <th className="py-3 px-4">Stock</th>
            <th className="py-3 px-4 text-center">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-base-300 text-sm">
          {filteredProducts.slice(0, entries).map((product, index) => {
            const pId = product.productId || product.code || product.id;

            return (
              <motion.tr
                key={pId || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="hover:bg-base-200/40 transition-colors"
              >
                <td className="font-medium text-base-content/70 px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="size-10 bg-base-200 rounded-lg border border-base-300 flex items-center justify-center text-base-content/50">
                    <ImageIcon className="size-5" />
                  </div>
                </td>
                <td className="font-semibold text-primary font-mono px-4 py-3">{pId}</td>
                <td className="font-medium text-base-content px-4 py-3 max-w-xs truncate">
                  {product.productName || product.name}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="font-semibold block">{product.productGroup || product.group}</span>
                  <span className="text-base-content/60">{product.productSubGroup || product.subGroup}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="badge badge-ghost badge-sm font-semibold uppercase">
                    {product.selectedUnit || product.unit || "Pcs"}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  ৳ {Number(product.purchasePrice || product.price || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-semibold text-success">
                  ৳ {Number(product.unitPrice || product.tpPrice || product.price || 0).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`badge badge-sm font-bold ${
                      (product.quantity ?? product.stock ?? 0) > 10
                        ? "badge-success/20 text-success"
                        : "badge-warning/20 text-warning"
                    }`}
                  >
                    {product.quantity ?? product.stock ?? 0}
                  </span>
                </td>

                {/* Action Column */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {/* Edit Button - Connected with onClick and console.log */}
                    <button
                      onClick={() => {
                        console.log("👉 [ProductTable] Edit clicked for product:", product);
                        if (onEditProduct) onEditProduct(product);
                      }}
                      className="btn btn-square btn-xs bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                      title="Edit"
                    >
                      <Edit className="size-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDeleteProduct(pId)}
                      className="btn btn-square btn-xs bg-rose-500 hover:bg-rose-600 text-white border-0"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>

                    {/* Print Button */}
                    <button
                      onClick={() => onPrintProduct(product)}
                      className="btn btn-square btn-xs bg-blue-500 hover:bg-blue-600 text-white border-0"
                      title="Print Details"
                    >
                      <Printer className="size-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;