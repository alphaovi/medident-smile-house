import  { useMemo } from "react";
import Select from "react-select";
import { Trash2 } from "lucide-react";

const rowSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "32px",
    height: "32px",
    fontSize: "13px",
    borderRadius: "0.375rem",
    borderColor: state.isFocused ? "#0d9488" : "#d1d5db",
    boxShadow: "none",
    "&:hover": { borderColor: "#0d9488" },
  }),
  valueContainer: (provided) => ({ ...provided, padding: "0 6px" }),
  indicatorsContainer: (provided) => ({ ...provided, height: "32px" }),
  menu: (provided) => ({ ...provided, fontSize: "13px", zIndex: 9999 }),
};

const SaleItemRow = ({
  idx,
  item,
  calcItem,
  itemsLength,
  availableGroups = [],
  productsGroupSubgroup = [],
  products = [],
  handleItemChange,
  handleRemoveItemRow,
}) => {
  const currentGroupName = item.selectedGroup?.value || item.selectedGroup;

  const subGroupOptions = useMemo(() => {
    if (!currentGroupName || !Array.isArray(productsGroupSubgroup)) return [];
    const foundGroup = productsGroupSubgroup.find(
      (g) => (g.group || g.groupName || g.name) === currentGroupName
    );
    if (!foundGroup) return [];
    const subs = foundGroup?.subgroups || foundGroup?.subGroup || foundGroup?.subcategories || [];
    return subs
      .map((sub) => {
        const subName = typeof sub === "string" ? sub : sub.subGroup || sub.name;
        return subName ? { value: subName, label: subName } : null;
      })
      .filter(Boolean);
  }, [currentGroupName, productsGroupSubgroup]);

  const currentSubGroupName = item.selectedSubGroup?.value || item.selectedSubGroup;

  const productOptions = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products
      .filter((p) => {
        const pGroup = p.group || p.productGroup;
        const pSubGroup = p.subGroup || p.subgroup;
        if (currentGroupName && pGroup !== currentGroupName) return false;
        if (currentSubGroupName && pSubGroup && pSubGroup !== currentSubGroupName) return false;
        return true;
      })
      .map((p) => ({
        value: p.productId || p._id,
        label: p.productName || p.name,
      }));
  }, [products, currentGroupName, currentSubGroupName]);

  // Alternating row background logic:
  // Jodi idx even (0, 2, 4...) hoy tahole bg-white, r odd (1, 3, 5...) hole bg-base-200/60 (halka gray)
  const rowBackground = idx % 2 === 0 ? "bg-white" : "bg-base-200/60";

  return (
    <div className={`flex flex-col lg:flex-row items-stretch lg:items-center gap-2 p-3 rounded-xl border border-base-300 justify-end transition-all ${rowBackground} shadow-sm hover:shadow-md`}>
      {/* Group */}
      <div className="w-full lg:flex-1">
        <label className="text-[11px] font-semibold text-base-content/70 lg:hidden">Group</label>
        <Select
          value={item.selectedGroup}
          onChange={(val) => handleItemChange(idx, "selectedGroup", val)}
          options={availableGroups}
          placeholder="Group"
          styles={rowSelectStyles}
          isSearchable
          isClearable
        />
      </div>

      {/* Sub-Group */}
      <div className="w-full lg:flex-1">
        <label className="text-[11px] font-semibold text-base-content/70 lg:hidden">Sub-Group</label>
        <Select
          value={item.selectedSubGroup}
          onChange={(val) => handleItemChange(idx, "selectedSubGroup", val)}
          options={subGroupOptions}
          placeholder="Sub-Group"
          isDisabled={!currentGroupName}
          styles={rowSelectStyles}
          isSearchable
          isClearable
        />
      </div>

      {/* Product */}
      <div className="w-full lg:flex-1">
        <label className="text-[11px] font-semibold text-base-content/70 lg:hidden">Product</label>
        <Select
          value={item.productId}
          onChange={(val) => handleItemChange(idx, "productId", val)}
          options={productOptions}
          placeholder="Search Product..."
          styles={rowSelectStyles}
          isSearchable
          isClearable
        />
      </div>

      {/* Stock */}
      <div className="w-full lg:w-16">
        <label className="text-[11px] font-semibold text-base-content/70 lg:hidden">Stock</label>
        <input
          type="number"
          readOnly
          value={item.currentStock || 0}
          className="input input-bordered input-sm h-[32px] w-full text-center bg-base-200 text-xs font-medium cursor-not-allowed"
        />
      </div>

      {/* Quantity */}
      <div className="w-full lg:w-16">
        <label className="text-[11px] font-semibold text-base-content/70 lg:hidden">Quantity</label>
        <input
          type="number"
          min="1"
          value={item.orderQty}
          onChange={(e) => handleItemChange(idx, "orderQty", e.target.value)}
          className="input input-bordered input-sm h-[32px] w-full text-center text-xs font-medium bg-base-100"
        />
      </div>

      {/* Unit Price */}
      <div className="w-full lg:w-20">
        <label className="text-[11px] font-semibold text-base-content/70 lg:hidden">Price (৳)</label>
        <input
          type="number"
          value={item.unitPrice}
          onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
          className="input input-bordered input-sm h-[32px] w-full text-center text-xs font-medium bg-base-100"
        />
      </div>

      {/* Discount */}
      <div className="w-full lg:w-32 flex gap-1">
        <select
          value={item.discountType}
          onChange={(e) => handleItemChange(idx, "discountType", e.target.value)}
          className="select select-bordered select-sm h-[32px] text-xs px-1 w-14 bg-base-100"
        >
          <option value="percent">%</option>
          <option value="fixed">৳</option>
        </select>
        <input
          type="number"
          value={item.discountValue}
          onChange={(e) => handleItemChange(idx, "discountValue", e.target.value)}
          className="input input-bordered input-sm h-[32px] w-full text-center text-xs font-medium bg-base-100"
          placeholder="Disc"
        />
      </div>

      {/* Total Price */}
      <div className="w-full lg:w-20 text-right font-medium text-xs hidden lg:block">
        ৳ {calcItem?.totalPrice?.toFixed(2) || "0.00"}
      </div>

      {/* After Discount */}
      <div className="w-full lg:w-24 text-right font-bold text-xs text-teal-600 hidden lg:block">
        ৳ {calcItem?.afterDiscountPrice?.toFixed(2) || "0.00"}
      </div>

      {/* Remove Button */}
      <div className="w-full lg:w-8 flex justify-end lg:justify-center">
        <button
          type="button"
          onClick={() => handleRemoveItemRow(idx)}
          disabled={itemsLength === 1}
          className="btn btn-ghost btn-xs text-error hover:bg-error/10 disabled:opacity-30"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default SaleItemRow;