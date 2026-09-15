import { motion } from "framer-motion";
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
  // Find sub-groups based on selected group from productsGroupSubgroup.json
  const matchedGroupObj = Array.isArray(productsGroupSubgroup)
    ? productsGroupSubgroup.find(
        (g) => (g.group || g.groupName || g.name) === item.selectedGroup,
      )
    : null;

  const availableSubGroups = matchedGroupObj
    ? matchedGroupObj.subGroup || matchedGroupObj.subGroups || []
    : [];

  // Filter products based on selected group & sub-group from products.json
  const filteredProducts = products.filter((p) => {
    const matchGroup =
      !item.selectedGroup ||
      p.productGroup === item.selectedGroup ||
      p.group === item.selectedGroup;

    const matchSubGroup =
      !item.selectedSubGroup ||
      p.productSubGroup === item.selectedSubGroup ||
      p.subGroup === item.selectedSubGroup;

    return matchGroup && matchSubGroup;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap lg:flex-nowrap items-center gap-2 bg-base-200/50 p-2 rounded-xl border border-base-300 text-xs"
    >
      {/* Group */}
      <div className="w-full sm:w-28">
        <select
          value={item.selectedGroup}
          onChange={(e) =>
            handleItemChange(idx, "selectedGroup", e.target.value)
          }
          className="select select-bordered select-xs w-full"
        >
          <option value="">Group...</option>
          {availableGroups.map((g, i) => (
            <option key={i} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-Group */}
      <div className="w-full sm:w-28">
        <select
          value={item.selectedSubGroup}
          disabled={!item.selectedGroup}
          onChange={(e) =>
            handleItemChange(idx, "selectedSubGroup", e.target.value)
          }
          className="select select-bordered select-xs w-full disabled:opacity-50"
        >
          <option value="">Sub-Group...</option>
          {availableSubGroups.map((sg, i) => (
            <option key={i} value={typeof sg === "string" ? sg : sg.name}>
              {typeof sg === "string" ? sg : sg.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product */}
      <div className="flex-1 min-w-[150px]">
        <select
          value={item.productId}
          onChange={(e) => handleItemChange(idx, "productId", e.target.value)}
          className="select select-bordered select-xs w-full font-medium"
        >
          <option value="">Select Product...</option>
          {filteredProducts.map((p) => {
            const pId = p.productId || p._id;
            const pName = p.productName || p.name;
            return (
              <option key={pId} value={pId}>
                {pName} ({p.selectedUnit || "pcs"})
              </option>
            );
          })}
        </select>
      </div>

      {/* Stock */}
      <div className="w-16 text-center">
        <span className="badge badge-ghost badge-sm w-full font-medium text-[11px] py-1">
          {item.currentStock}
        </span>
      </div>

      {/* Quantity */}
      <div className="w-16">
        <input
          type="number"
          min="1"
          value={item.orderQty}
          onChange={(e) => handleItemChange(idx, "orderQty", e.target.value)}
          className="input input-bordered input-xs w-full text-center font-bold"
        />
      </div>

      {/* Unit Price */}
      <div className="w-20">
        <input
          type="number"
          min="0"
          value={item.unitPrice}
          onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
          className="input input-bordered input-xs w-full text-right"
        />
      </div>

      {/* Discount */}
      <div className="w-32 flex gap-1">
        <input
          type="number"
          min="0"
          value={item.discountValue}
          onChange={(e) =>
            handleItemChange(idx, "discountValue", e.target.value)
          }
          placeholder={item.discountType === "percent" ? "%" : "৳"}
          className="input input-bordered input-xs w-full text-center"
        />
        <select
          value={item.discountType}
          onChange={(e) =>
            handleItemChange(idx, "discountType", e.target.value)
          }
          className="select select-bordered select-xs font-bold text-teal-600 px-1"
        >
          <option value="percent">%</option>
          <option value="amount">৳</option>
        </select>
      </div>

      {/* Total Price */}
      <div className="w-20 text-right">
        <span className="font-semibold text-xs text-base-content/70 block px-1">
          ৳ {calcItem?.totalPrice ? calcItem.totalPrice.toFixed(2) : "0.00"}
        </span>
      </div>

      {/* After Discount */}
      <div className="w-24 text-right">
        <span className="font-bold text-xs text-teal-600 block px-1">
          ৳{" "}
          {calcItem?.afterDiscountPrice
            ? calcItem.afterDiscountPrice.toFixed(2)
            : "0.00"}
        </span>
      </div>

      {/* Delete Action */}
      <div className="w-8 flex justify-center">
        <button
          type="button"
          onClick={() => handleRemoveItemRow(idx)}
          disabled={itemsLength === 1}
          className="btn btn-square btn-ghost btn-xs text-error hover:bg-error/10 disabled:opacity-20"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default SaleItemRow;
