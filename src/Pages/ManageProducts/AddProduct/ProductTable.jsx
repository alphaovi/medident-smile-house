import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";

const ProductTable = ({
  products: initialProducts = [],
  searchTerm = "",
  entries = 10,
  onEditProduct,
  onToggleStatus,
}) => {
  const [productList, setProductList] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state when props change
  useEffect(() => {
    setProductList(initialProducts);
    setCurrentPage(1); // সার্চ বা এন্ট্রি চেঞ্জ হলে প্রথম পেজে নিয়ে যাবে
  }, [initialProducts, searchTerm, entries]);

  // Handle Toggle directly
  const handleToggle = (product, index) => {
    const targetId = product.productId || product.code || product.id;

    const currentActive = product.isActive !== undefined ? Boolean(product.isActive) : true;
    const newActiveState = !currentActive;

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

    if (onToggleStatus) {
      onToggleStatus({
        ...product,
        isActive: newActiveState,
      });
    }
  };

  // Filter products by search keyword
  const filteredProducts = productList.filter((p) => {
    const productName = p.productName || p.name || "";
    const productId = p.productId || p.code || p.id || "";
    const groupName = typeof p.group === "object" ? p.group?.groupName : (p.productGroup || p.group || "");

    return (
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      groupName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination Logic
  const isAll = entries === "all" || entries === "All";
  const itemsPerPage = isAll ? filteredProducts.length || 1 : Number(entries);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = isAll ? filteredProducts : filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
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
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => {
                const pId = product.productId || product.code || product.id;
                const isActive = product.isActive !== undefined ? Boolean(product.isActive) : true;

                const displayGroupName = 
                  typeof product.group === "object" && product.group !== null
                    ? product.group.groupName
                    : (product.productGroup || product.group || "N/A");

                const displaySubGroupName = 
                  typeof product.subGroup === "object" && product.subGroup !== null
                    ? product.subGroup.subGroupName
                    : (product.productSubGroup || product.subGroup || "");

                const serialNumber = isAll ? index + 1 : startIndex + index + 1;

                return (
                  <motion.tr
                    key={pId || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.01 }}
                    className={`hover:bg-base-200/40 transition-colors ${
                      !isActive ? "opacity-50 bg-base-200/40" : ""
                    }`}
                  >
                    <td className="font-medium text-base-content/70 px-4 py-3">
                      {serialNumber}
                    </td>

                    <td className="font-semibold text-primary font-mono px-4 py-3">
                      {pId}
                    </td>
                    <td className="font-medium text-base-content px-4 py-3 max-w-xs truncate">
                      {product.productName || product.name}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="font-semibold block">
                        {displayGroupName}
                      </span>
                      <span className="text-base-content/60">
                        {displaySubGroupName}
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
                        product.unitPrice || product.sellingPrice || product.tpPrice || product.price || 0
                      ).toLocaleString()}
                    </td>

                    {/* Action Column */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
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
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-base-content/60">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      {!isAll && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-base-300 gap-3 text-xs">
          <div className="text-base-content/60">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredProducts.length}</span> entries
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-xs btn-outline gap-1"
            >
              <ChevronLeft className="size-3.5" /> Prev
            </button>

            <span className="px-3 py-1 font-semibold bg-base-200 rounded">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-xs btn-outline gap-1"
            >
              Next <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;