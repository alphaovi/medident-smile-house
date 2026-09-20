import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SingleSellList from "./SingleSellList";

const SellLists = () => {
    const [sellListDatas, setSellListDatas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/sellList.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch sell list data.");
                }
                return res.json();
            })
            .then((data) => {
                setSellListDatas(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading sell list:", error);
                toast.error("Failed to load sell list data!");
                setLoading(false);
            });
    }, []);

    // Send Back ক্লিক করলে স্ট্যাটাস Pending করে দেওয়া হবে এবং টেবিলে শুধু Deliveredগুলো ফিল্টার থাকবে
    const handleSendBackOrder = (orderNo) => {
        setSellListDatas((prevOrders) =>
            prevOrders.map((order) =>
                order.orderNo === orderNo ? { ...order, status: "Pending" } : order
            )
        );
        toast.info(`Order ${orderNo} has been sent back to Pending!`);
    };

    // শুধুমাত্র Delivered অর্ডারগুলো ফিল্টার করে টেবিলে দেখানো হবে
    const deliveredOrders = sellListDatas.filter(
        (order) => order.status === "Delivered"
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <p className="text-gray-600 font-medium text-lg">Loading sell lists...</p>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50 relative">
            <ToastContainer position="top-right" autoClose={2000} limit={1} />
            
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">All Delivered Sell Lists</h1>
                    <p className="text-sm text-gray-500">Manage and view all delivered individual sell orders in a clean table format.</p>
                </div>

                <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
                    <table className="table w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 border-b border-gray-200 text-xs uppercase tracking-wider">
                                <th className="p-3">Date</th>
                                <th className="p-3">Order No</th>
                                <th className="p-3">Client Info</th>
                                <th className="p-3">Product</th>
                                <th className="p-3 text-right">Total Amount</th>
                                <th className="p-3 text-right">Paid</th>
                                <th className="p-3 text-right">Due</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-sm">
                            {deliveredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="p-12 text-center text-gray-500 font-medium">
                                        No delivered orders found.
                                    </td>
                                </tr>
                            ) : (
                                deliveredOrders.map((order, index) => {
                                    const rowKey = order.orderNo || index;
                                    return (
                                        <SingleSellList
                                            key={rowKey} 
                                            order={order} 
                                            onSendBack={handleSendBackOrder}
                                        />
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellLists;