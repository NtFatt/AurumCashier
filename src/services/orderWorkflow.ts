import api from "@/lib/api";

/**
 * CASHIER LẤY DANH SÁCH ĐƠN CHỜ CASHIER XÁC NHẬN
 * Status: 'pending', 'waiting'
 */
export async function fetchCashierOrders() {
  try {
    const res = await api.get("/api/pos/orders");

    const list = Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    return list.map((o: any) => ({
      id: o.Id,
      userId: o.UserId,
      total: o.Total,
      status: o.Status,
      paymentStatus: o.PaymentStatus,
      createdAt: o.CreatedAt,
      customerName: o.CustomerName || "Khách lẻ",
      items: Array.isArray(o.Items) ? o.Items : []
    }));
  } catch (err) {
    console.error(">>> fetchCashierOrders ERROR:", err);
    return [];
  }
}

/**
 * CASHIER XÁC NHẬN ĐƠN
 * Status: pending → waiting
 * FE gọi POS API, KHÔNG dùng ADMIN WORKFLOW
 */
export async function sendOrderToBarista(id: number) {
  try {
    const res = await api.post(`/api/pos/orders/send/${id}`);
    return res.data;
  } catch (err) {
    console.error(">>> sendOrderToBarista ERROR:", err);
    throw err;
  }
}

/**
 * CASHIER ĐÁNH DẤU ĐƠN THANH TOÁN
 */
export async function payOrder(orderId: number, paymentMethod: string, amountPaid: number) {
  try {
    const res = await api.post(`/api/pos/orders/pay/${orderId}`, {
      paymentMethod,
      amountPaid,
    });
    return res.data;
  } catch (err) {
    console.error(">>> payOrder ERROR:", err);
    throw err;
  }
}
