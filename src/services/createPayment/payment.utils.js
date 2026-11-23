export const calculateSelectedDueSum = (idsList, ordersArr = []) =>
  idsList.reduce((sum, id) => {
    const item = ordersArr.find((c) => c.id === id);
    return sum + (item ? Number(item.dueAmount) || 0 : 0);
  }, 0);

export const buildMergedActiveUsers = (rawUsers = [], banksArr = [], currentUser = null) => {
  const userMap = new Map();

  rawUsers
    .filter((u) => {
      const pending = ["pending"].includes(String(u.status || u.role || "").toLowerCase());
      return !pending && u.isActive !== false;
    })
    .forEach((u) => u?._id && userMap.set(String(u._id), u));

  banksArr.forEach((b) => {
    if (b?.user?._id && !userMap.has(String(b.user._id))) {
      userMap.set(String(b.user._id), b.user);
    }
  });

  if (currentUser?._id && !userMap.has(String(currentUser._id))) {
    userMap.set(String(currentUser._id), currentUser);
  }

  return Array.from(userMap.values()).sort((a, b) =>
    String(a._id) === String(currentUser?._id) ? -1 : String(b._id) === String(currentUser?._id) ? 1 : 0
  );
};

export const formatCustomerOrders = (customerId, ordersSource = []) =>
  ordersSource
    .filter((ord) => String(ord.customer?._id || ord.customer) === String(customerId))
    .map((ord) => {
      const grandTotal = Number(ord.grandTotal) || 0;
      const paidAmount = Number(ord.paidAmount) || 0;
      return {
        id: ord._id,
        orderNo: ord._id?.slice(-6)?.toUpperCase(),
        orderDate: ord.orderDate ? new Date(ord.orderDate).toISOString().split("T")[0] : "-",
        grandTotal,
        paidAmount,
        dueAmount: ord.dueAmount !== undefined ? Number(ord.dueAmount) : Math.max(0, grandTotal - paidAmount),
        status: ord.status || "pending",
        payments: Array.isArray(ord.payments) ? ord.payments : [],
      };
    });