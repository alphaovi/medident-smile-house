import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SingleSellList from "./SingleSellList";
import { useSaleOrderServices } from "../../../services/saleOrderService/useSaleOrderServices";

const SellLists = () => {
    const [sellListDatas, setSellListDatas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveredOrders();
    }, []);

    const fetchDeliveredOrders = async () => {
        try {
            setLoading(true);
            const res = await useSaleOrderServices.getAllSaleOrders();
            const orderList = Array.isArray(res) ? res : (res?.data || res?.result || []);
            
            const formattedData = orderList.map((order) => ({
                ...order,
                // Custom readable ID or fallback to last 6 chars of _id
                orderNo: order.id || order._id?.slice(-6).toUpperCase(),
                realId: order._id,
                customerName: order.customer?.name || order.customer?.customerName || "N/A",
                customerState: order.customer?.state || order.stateOrRegion || "N/A",
                customerOffice: order.customer?.address || order.customer?.office || "",
                subtotal: order.grandTotal || 0,
                status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending",
                products: Array.isArray(order.products) ? order.products.map(p => ({
                    productName: p.product?.name || p.product?.productName || "Product",
                    orderQuantity: p.quantity || 1,
                    unitPrice: p.price || 0,
                    total: p.afterDiscount || p.totalPrice || 0
                })) : []
            }));

            setSellListDatas(formattedData);
        } catch (error) {
            console.error("Error loading sell list:", error);
            toast.error("Failed to load sell list data!");
        } finally {
            setLoading(false);
        }
    };

    const handleSendBackOrder = async (realId) => {
        try {
            await useSaleOrderServices.updateOrderStatus(realId, "Pending");

            setSellListDatas((prevOrders) =>
                prevOrders.map((order) =>
                    order.realId === realId ? { ...order, status: "Pending" } : order
                )
            );
            toast.info(`Order has been sent back to Pending!`);
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error("Failed to send back order status.");
        }
    };

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
                                    const rowKey = order.realId || index;
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