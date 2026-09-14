import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateSaleModal from "./CreateSaleModal";

const ManageSellOrders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [states, setStates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsGroupSubgroup, setProductsGroupSubgroup] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stateRes, custRes, prodRes, groupRes] = await Promise.all([
          fetch("/customerCountryState.json"),
          fetch("/customers.json"),
          fetch("/productsData.json"), // অথবা আপনার প্রোডাক্টের সোর্স
          fetch("/productsGroupSubgroup.json"),
        ]);

        const stateData = await stateRes.json();
        const custData = await custRes.json();
        const prodData = await prodRes.json();
        const groupData = await groupRes.json();

        setStates(stateData);
        setCustomers(custData);
        setProducts(prodData);
        setProductsGroupSubgroup(groupData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dependency data for sales.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveSale = (saleData) => {
    console.log("Saved Sale Data:", saleData);
    toast.success("Sell order created successfully!");
  };

  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sell Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-sm bg-teal-600 hover:bg-teal-700 text-white"
        >
          + Create Sale Order
        </button>
      </div>

      <CreateSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        states={states}
        customers={customers}
        products={products}
        productsGroupSubgroup={productsGroupSubgroup}
        onSaveSale={handleSaveSale}
      />
    </div>
  );
};

export default ManageSellOrders;