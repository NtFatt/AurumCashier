import api from "@/lib/api";

export async function fetchNewOrders() {
  try {
    const res = await api.get("/api/pos/orders");

    // -------------------------------------------------------
    // 1) Chuẩn hóa dữ liệu đầu vào
    // -------------------------------------------------------
    const raw = Array.isArray(res.data?.data) ? res.data.data : [];

    // -------------------------------------------------------
    // 2) Map từng order sang cấu trúc FE-Cashier
    // -------------------------------------------------------
    return raw
      .filter((o: any) => {
        // POS KHÔNG nhận Delivery
        if (o.FulfillmentMethod === "Delivery") return false;

        // POS chỉ nhận pending / waiting / preparing
        return ["pending", "waiting", "preparing", "completed"]
          .includes(o.Status?.toLowerCase());
      })
      .map((o: any) => {
        const createdAt = o.CreatedAt
          ? new Date(o.CreatedAt)
          : new Date();

        const items = Array.isArray(o.Items)
          ? o.Items.map((i: any) => ({
              id: i.ProductId,
              productId: i.ProductId,
              quantity: i.Quantity,
              price: Number(i.Price) || 0,

              name: i.ProductName ?? "Sản phẩm",
              image: i.ImageUrl ?? null,

              // POS KHÔNG dùng size/topping
              size: i.Size ?? null,
              toppings: i.Toppings ?? [],
              notes: i.Notes ?? "",
            }))
          : [];

        return {
          id: o.Id,
          orderNumber: o.Id,

          // thời gian tạo
          time: createdAt,
          createdAt: createdAt,

          // POS luôn coi là takeaway
          type: o.FulfillmentMethod || "AtStore",

          total: Number(o.Total) || 0,
          status: o.Status,
          paymentStatus: o.PaymentStatus ?? "Unpaid",

          customerName: o.CustomerName ?? "Khách lẻ",

          items: items,
        };
      });

  } catch (err) {
    console.error(">>> fetchNewOrders ERROR:", err);
    return [];
  }
}
