import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";

const ProductTable = ({
  products: initialProducts = [],
  searchTerm = "",
  entries = 10,
  onEditProduct,
  onToggleStatus,
}) => {
  // Table Local State handle
  const [productList, setProductList] = useState(initialProducts);

  // Sync state when props change
  useEffect(() => {
    setProductList(initialProducts);
  }, [initialProducts]);

  // Handle Toggle directly
  const handleToggle = (product, index) => {
    const targetId = product.productId || product.code || product.id;

    // বর্তমান আইটেমের অ্যাক্টিভ স্ট্যাটাস বের করা
    const currentActive = product.isActive !== undefined ? Boolean(product.isActive) : true;
    const newActiveState = !currentActive;

    // লোকাল স্টেট আপডেট করা যাতে UI সাথে সাথে পরিবর্তন হয়
    setProductList((prevList) =>
      prevList.map((item, i) => {
        const itemId = item.productId || item.code || item.id;

        if ((targetId && itemId === targetId) || i === index) {
          return {
            ...item,
            isActive: newActiveState,
          };
        }
        return item;
      })
    );

    // প্যারেন্ট কম্পোনেন্টে আপডেট ডেটা পাঠানো
    if (onToggleStatus) {
      onToggleStatus({
        ...product,
        isActive: newActiveState,
      });
    }
  };

  // Filter products by search keyword
  const filteredProducts = productList.filter(
    (p) =>
      (p.productName || p.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (p.productId || p.code || p.id || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (p.productGroup || p.group || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="table w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="bg-base-200/80 text-base-content text-xs uppercase font-bold border-b border-base-300">
            <th className="py-3 px-4">#SN.</th>
            <th className="py-3 px-4">Code</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Group / SubGroup</th>
            <th className="py-3 px-4">Unit</th>
            <th className="py-3 px-4">Purchase-Price</th>
            <th className="py-3 px-4">Selling-Price</th>
            <th className="py-3 px-4 text-center">Action</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-base-300 text-sm">
          {filteredProducts.slice(0, entries).map((product, index) => {
            const pId = product.productId || product.code || product.id;
            const isActive = product.isActive !== undefined ? Boolean(product.isActive) : true;

            return (
              <motion.tr
                key={pId || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={`hover:bg-base-200/40 transition-colors ${
                  !isActive ? "opacity-50 bg-base-200/40" : ""
                }`}
              >
                <td className="font-medium text-base-content/70 px-4 py-3">
                  {index + 1}
                </td>

                <td className="font-semibold text-primary font-mono px-4 py-3">
                  {pId}
                </td>
                <td className="font-medium text-base-content px-4 py-3 max-w-xs truncate">
                  {product.productName || product.name}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className="font-semibold block">
                    {product.productGroup || product.group}
                  </span>
                  <span className="text-base-content/60">
                    {product.productSubGroup || product.subGroup}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="badge badge-ghost badge-sm font-semibold uppercase">
                    {product.selectedUnit || product.unit || "Pcs"}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  {Number(
                    product.purchasePrice || product.price || 0
                  ).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-semibold text-success">
                  {Number(
                    product.unitPrice || product.tpPrice || product.price || 0
                  ).toLocaleString()}
                </td>

                {/* Action Column */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onEditProduct) onEditProduct(product);
                      }}
                      className="btn btn-square btn-xs bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                      title="Edit"
                    >
                      <Edit className="size-3.5" />
                    </button>

                    {/* Active/Inactive Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggle(product, index)}
                      className={`btn btn-xs gap-1.5 border-0 min-w-[82px] justify-start px-2.5 ${
                        isActive
                          ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25"
                          : "bg-rose-500/15 text-rose-600 hover:bg-rose-500/25"
                      }`}
                      title={
                        isActive ? "Click to Deactivate" : "Click to Activate"
                      }
                    >
                      <span
                        className={`size-1.5 rounded-full shrink-0 ${
                          isActive ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      <span className="text-[10px] font-bold uppercase text-left truncate">
                        {isActive ? "Active" : "Inactive"}
                      </span>
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