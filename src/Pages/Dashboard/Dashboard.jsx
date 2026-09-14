import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  MoreVertical,
} from "lucide-react";

const Dashboard = () => {
  // অ্যানিমেশন ভ্যারিয়েন্ট
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "৳ 1,24,500",
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign className="size-6 text-primary" />,
    },
    {
      title: "Total Orders",
      value: "1,450",
      change: "+8.2%",
      isPositive: true,
      icon: <ShoppingBag className="size-6 text-secondary" />,
    },
    {
      title: "New Customers",
      value: "320",
      change: "-2.4%",
      isPositive: false,
      icon: <Users className="size-6 text-accent" />,
    },
    {
      title: "Growth Rate",
      value: "24.8%",
      change: "+4.1%",
      isPositive: true,
      icon: <TrendingUp className="size-6 text-info" />,
    },
  ];

  const recentOrders = [
    { id: "#ORD-8541", customer: "Tanvir Ahmed", product: "Wireless Mouse", amount: "৳ 1,200", status: "Completed" },
    { id: "#ORD-8540", customer: "Rahim Ali", product: "Mechanical Keyboard", amount: "৳ 4,500", status: "Pending" },
    { id: "#ORD-8539", customer: "Nusrat Jahan", product: "USB-C Hub", amount: "৳ 2,100", status: "Completed" },
    { id: "#ORD-8538", customer: "Sakib Hasan", product: "Gaming Monitor", amount: "৳ 18,500", status: "Cancelled" },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ---------------- Header ---------------- */}
      

      {/* ---------------- Stats Grid ---------------- */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="p-5 bg-base-200/60 rounded-2xl border border-base-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/70 font-medium">{stat.title}</span>
              <div className="p-2.5 bg-base-100 rounded-xl shadow-sm">{stat.icon}</div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span
                className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  stat.isPositive
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                }`}
              >
                {stat.isPositive ? <ArrowUpRight className="size-3 mr-0.5" /> : <ArrowDownRight className="size-3 mr-0.5" />}
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ---------------- Main Content Grid ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-base-200/60 rounded-2xl border border-base-300 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Recent Orders</h2>
              <p className="text-xs text-base-content/70">Overview of latest customer purchases</p>
            </div>
            <button className="btn btn-ghost btn-xs">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-base-300">
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-base-300/50 hover:bg-base-100/50 transition-colors">
                    <td className="font-medium text-xs">{order.id}</td>
                    <td className="text-sm">{order.customer}</td>
                    <td className="text-sm text-base-content/80">{order.product}</td>
                    <td className="text-sm font-semibold">{order.amount}</td>
                    <td>
                      <span
                        className={`badge badge-sm font-medium ${
                          order.status === "Completed"
                            ? "badge-success/20 text-success border-0"
                            : order.status === "Pending"
                            ? "badge-warning/20 text-warning border-0"
                            : "badge-error/20 text-error border-0"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Action / Notice Card */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 via-base-200/60 to-base-200/60 rounded-2xl border border-primary/20 p-5 relative overflow-hidden">
            <h3 className="text-base font-bold mb-1">Store Performance</h3>
            <p className="text-xs text-base-content/70 mb-4">Your sales increased by 12% compared to last week.</p>
            <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden mb-2">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "72%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-xs text-base-content/70 font-medium">
              <span>Target: ৳ 1,50,000</span>
              <span>72%</span>
            </div>
          </div>

          <div className="bg-base-200/60 rounded-2xl border border-base-300 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold">Top Product</h3>
              <MoreVertical className="size-4 text-base-content/60 cursor-pointer" />
            </div>
            <div className="flex items-center gap-3">
              <div className="size-12 bg-base-300 rounded-xl flex items-center justify-center font-bold text-lg text-primary">
                🎧
              </div>
              <div>
                <p className="font-semibold text-sm">Wireless Headphones</p>
                <p className="text-xs text-base-content/70">124 Sales this week</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;