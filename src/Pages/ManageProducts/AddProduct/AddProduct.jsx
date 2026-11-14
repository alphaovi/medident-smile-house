import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FolderPlus, Search, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import ProductTable from "./ProductTable";
import AddProductFormModal from "./AddProductFormModal";
import EditProductModal from "./EditProductModal";
import ManageGroupModal from "./ManageGroupSubgroup/ManageGroupModal";
import { createProduct, deleteProduct, fetchGroups, fetchProducts, fetchSubGroups, updateProduct } from "../../../services/addProduct/addProductServiceRequest";

const AddProduct = () => {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState(10);

  // React Query অপ্টিমাইজেশন: staleTime ও placeholderData যুক্ত করা হয়েছে যাতে দ্রুত ডাটা দেখায়
  const { data: products = [], isLoading: loading, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // ৫ মিনিট পর্যন্ত ডেটা ফ্রেশ রাখবে
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // ব্যাকগ্রাউন্ডে ফেচ হওয়ার সময়ও আগের ডেটা ধরে রাখবে (ফ্লিকার করবে না)
  });

  const { data: groups = [] } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 1000 * 60 * 10,
  });

  const { data: subGroups = [] } = useQuery({
    queryKey: ["subgroups"],
    queryFn: fetchSubGroups,
    staleTime: 1000 * 60 * 10,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("New product added successfully!", { autoClose: 2000 });
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateProduct({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully! 🎉", { autoClose: 3000 });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const handleAddProduct = (formData) => {
    const payload = {
      id: formData.productId, 
      name: formData.productName,
      code: formData.productId,
      group: formData.productGroup,
      subGroup: formData.productSubGroup,
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellingPrice: Number(formData.unitPrice) || 0,
      weight: Number(formData.weight) || 0,
      unit: formData.selectedUnit,
    };

    createMutation.mutate(payload);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = (updatedData) => {
    const id = updatedData.id || updatedData._id || updatedData.productId;
    
    if (!id) {
      toast.error("Product ID is missing!");
      return;
    }

    const payload = {
      id: updatedData.productId,
      name: updatedData.productName,
      purchasePrice: Number(updatedData.buyingPrice),
      sellingPrice: Number(updatedData.sellingPrice),
      weight: Number(updatedData.weight),
      unit: updatedData.unit,
      group: updatedData.productGroup,
      subGroup: updatedData.productSubGroup,
    };

    updateMutation.mutate({ id, payload });
  };

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: "Delete",
      text: "Are you sure you want to delete this item?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded text-sm",
        cancelButton: "bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded border border-gray-300 text-sm",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(productId);
      }
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">Products List</h2>
            {/* ব্যাকগ্রাউন্ডে ডেটা রিফেচ হলে ছোট ইন্ডিকেটর দেখাবে */}
            {isFetching && !loading && (
              <span className="flex items-center gap-1 text-xs text-primary font-medium animate-pulse">
                <Loader2 className="size-3 animate-spin" /> Syncing...
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsGroupModalOpen(true)} className="btn text-white bg-teal-600 hover:bg-teal-700 btn-sm gap-2 border-0">
              <FolderPlus className="size-4" /> Add Group / Subgroup
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm gap-2">
              <Plus className="size-4" /> New Product
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-base-200 bg-base-200/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Show</span>
            <select 
              value={entries} 
              onChange={(e) => setEntries(e.target.value === "all" ? "all" : Number(e.target.value))} 
              className="select select-bordered select-xs w-24"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value="all">All</option>
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

        {/* প্রথমবার লোড হওয়ার সময় স্পিনার দেখাবে, পরেরবার ক্যাশ থেকে ইনস্ট্যান্ট দেখাবে */}
        {loading && products.length === 0 ? (
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
            onEditProduct={handleEditProduct}
          />
        )}
      </div>

      <AddProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
        groups={groups}
        subGroupsList={subGroups}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={editingProduct}
        groups={groups}
        subGroupsList={subGroups}
        onUpdateProduct={handleUpdateProduct}
      />

      <ManageGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} groups={groups} subGroups={subGroups} />
    </motion.div>
  );
};

export default AddProduct;