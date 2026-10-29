// src/components/sale/SaleItemRow.jsx
import React, { useMemo } from "react";
import { Trash2 } from "lucide-react";

const SaleItemRow = ({
  idx,
  item,
  calcItem,
  itemsLength,
  availableGroups,
  productsGroupSubgroup,
  products,
  handleItemChange,
  handleRemoveItemRow,
}) => {
  const availableSubgroups = useMemo(() => {
    if (!Array.isArray(productsGroupSubgroup)) return [];
    const selectedGroupId = item.selectedGroup?.value || item.selectedGroup;
    if (!selectedGroupId) return [];

    return productsGroupSubgroup
      .filter((sub) => {
        const subGroupId = sub.group?._id || sub.group?.id || sub.group;
        return String(subGroupId) === String(selectedGroupId);
      })
      .map((sub) => ({
        value: sub._id || sub.id,
        label: sub.subGroupName || sub.name,
        ...sub,
      }));
  }, [productsGroupSubgroup, item.selectedGroup]);

  const availableProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const selectedGroupId = item.selectedGroup?.value || item.selectedGroup;
    const selectedSubGroupId = item.selectedSubGroup?.value || item.selectedSubGroup;

    return products
      .filter((prod) => {
        const prodGroupId = prod.group?._id || prod.group?.id || prod.group;
        const prodSubGroupId = prod.subGroup?._id || prod.subGroup?.id || prod.subGroup;

        const matchesGroup = !selectedGroupId || String(prodGroupId) === String(selectedGroupId);
        const matchesSubGroup = !selectedSubGroupId || String(prodSubGroupId) === String(selectedSubGroupId);

        return matchesGroup && matchesSubGroup;
      })
      .map((prod) => {
        const productName = 
          prod.name || 
          prod.productName || 
          prod.product?.name || 
          prod.product?.productName || 
          "Unnamed Product";

        // Ekhane strictly inventory/fetch dependency theke asha currentStock ke priority dewa holo
        const stockVal = 
          prod.currentStock ?? 
          (prod.totalStock !== undefined && prod.totalSell !== undefined ? prod.totalStock - prod.totalSell : null) ?? 
          prod.stock ?? 
          0;

        const priceVal = 
          prod.sellingPrice || 
          prod.unitPrice || 
          prod.price || 
          prod.avgBuyingPrice || 
          0;

        return {
          value: prod._id || prod.id,
          label: `${productName} (Stock: ${stockVal})`, // Dropdown-e sothik stock dekhabe
          productName,
          currentStock: stockVal,
          sellingPrice: priceVal,
          ...prod,
        };
      });
  }, [products, item.selectedGroup, item.selectedSubGroup]);

  const currentStockVal = calcItem?.currentStock ?? item.currentStock ?? 0;
  const isOutOfStock = currentStockVal <= 0 && item.productId;

  return (
    <div className={`flex flex-col lg:flex-row items-stretch lg:items-center gap-2 p-3 rounded-xl border transition-colors ${
      isOutOfStock ? "bg-red-50 border-red-300" : "bg-base-200/50 border-base-300"
    }`}>
      {/* Group Selection */}
      <div className="flex-1">
        <label className="text-[10px] font-bold lg:hidden text-base-content/70">Group</label>
        <select
          className="select select-bordered select-sm w-full"
          value={item.selectedGroup?.value || item.selectedGroup || ""}
          disabled={isOutOfStock}
          onChange={(e) => {
            const val = e.target.value;
            const found = availableGroups.find((g) => String(g.value) === String(val));
            handleItemChange(idx, "selectedGroup", found || val);
          }}
        >
          <option value="">Select Group</option>
          {availableGroups.map((group) => (
            <option key={group.value} value={group.value}>
              {group.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subgroup Selection */}
      <div className="flex-1">
        <label className="text-[10px] font-bold lg:hidden text-base-content/70">Sub-Group</label>
        <select
          className="select select-bordered select-sm w-full"
          value={item.selectedSubGroup?.value || item.selectedSubGroup || ""}
          disabled={!item.selectedGroup || isOutOfStock}
          onChange={(e) => {
            const val = e.target.value;
            const found = availableSubgroups.find((s) => String(s.value) === String(val));
            handleItemChange(idx, "selectedSubGroup", found || val);
          }}
        >
          <option value="">Select Sub-Group</option>
          {availableSubgroups.map((sub) => (
            <option key={sub.value} value={sub.value}>
              {sub.label}
            </option>
          ))}
        </select>
      </div>

      {/* Product Selection */}
      <div className="flex-1">
        <label className="text-[10px] font-bold lg:hidden text-base-content/70">Product</label>
        <select
          className="select select-bordered select-sm w-full"
          value={item.productId?.value || item.productId || ""}
          disabled={!item.selectedGroup || isOutOfStock}
          onChange={(e) => {
            const val = e.target.value;
            const found = availableProducts.find((p) => String(p.value) === String(val));
            handleItemChange(idx, "productId", found || val);
          }}
        >
          <option value="">Select Product</option>
          {availableProducts.map((prod) => (
            <option key={prod.value} value={prod.value}>
              {prod.label}
            </option>
          ))}
        </select>
      </div>

      {/* Stock */}
      <div className="w-full lg:w-16">
        <label className="text-[10px] font-bold lg:hidden text-base-content/70">Stock</label>
        <input
          type="text"
          readOnly
          className={`input input-bordered input-sm w-full text-center bg-base-100 font-bold ${
            isOutOfStock ? "text-red-600 bg-red-100" : "text-teal-700"
          }`}
          value={currentStockVal}
        />
      </div>

      {/* Quantity */}
      <div className="w-full lg:w-16">
        <label className="text-[10px] font-bold lg:hidden text-base-content/70">Quantity</label>
        <input
          type="number"
          min="0"
          readOnly={isOutOfStock}
          className={`input input-bordered input-sm w-full text-center ${isOutOfStock ? "bg-gray-100 cursor-not-allowed" : ""}`}
          value={item.orderQty}
          onChange={(e) => handleItemChange(idx, "orderQty", e.target.value)}
        />
      </div>

      {/* Unit Price */}
      <div className="w-full lg:w-20">
        <label className="text-[10px] font-bold lg:hidden text-base-content/70">Price</label>
        <input
          type="number"
          readOnly={isOutOfStock}
          className={`input input-bordered input-sm w-full text-center ${isOutOfStock ? "bg-gray-100 cursor-not-allowed" : ""}`}
          value={item.unitPrice}
          onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
        />
      </div>

      {/* Discount */}
      <div className="w-full lg:w-32 flex gap-1">
        <input
          type="number"
          readOnly={isOutOfStock}
          className={`input input-bordered input-sm w-16 text-center ${isOutOfStock ? "bg-gray-100 cursor-not-allowed" : ""}`}
          placeholder="Val"
          value={item.discountValue}
          onChange={(e) => handleItemChange(idx, "discountValue", e.target.value)}
        />
        <select
          className="select select-bordered select-sm w-16 px-1"
          disabled={isOutOfStock}
          value={item.discountType}
          onChange={(e) => handleItemChange(idx, "discountType", e.target.value)}
        >
          <option value="percent">%</option>
          <option value="flat">৳</option>
        </select>
      </div>

      {/* Total Price */}
      <div className="w-full lg:w-20 text-left lg:text-right font-semibold text-sm">
        <span className="lg:hidden font-bold text-xs">Total: </span>
        ৳{calcItem?.totalPrice?.toFixed(2) || "0.00"}
      </div>

      {/* After Discount */}
      <div className="w-full lg:w-24 text-left lg:text-right font-bold text-sm text-teal-600">
        <span className="lg:hidden font-bold text-xs text-base-content">After Disc: </span>
        ৳{calcItem?.afterDiscountPrice?.toFixed(2) || "0.00"}
      </div>

      {/* Remove Button */}
      <div className="w-full lg:w-8 flex justify-end lg:justify-center">
        {itemsLength > 1 && (
          <button
            type="button"
            className="btn btn-ghost btn-sm text-error p-0 hover:bg-error/10 cursor-pointer"
            onClick={() => handleRemoveItemRow(idx)}
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SaleItemRow;