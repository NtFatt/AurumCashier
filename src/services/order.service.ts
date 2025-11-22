import api from "@/lib/api";

export async function fetchNewOrders() {
  try {
    const res = await api.get("/api/pos/orders");

    const raw = Array.isArray(res.data?.data)
      ? res.data.data
      : [];

    return raw.map((o: any) => ({
      id: o.Id,
      orderNumber: o.Id,
      time: o.CreatedAt ? new Date(o.CreatedAt) : null,
      type: "take-away",

      total: Number(o.Total),
      status: o.Status,
      paymentStatus: o.PaymentStatus,

      createdAt: o.CreatedAt,

      items: Array.isArray(o.Items)
        ? o.Items.map((i: any) => ({
            id: i.ProductId,
            productId: i.ProductId,
            quantity: i.Quantity,
            price: i.Price ?? 0,

            name: i.ProductName,
            image: i.ImageUrl,

            // hệ POS KHÔNG CÓ size/toppings/notes
            size: null,
            toppings: [],
            notes: "",
          }))
        : [],
    }));
  } catch (err) {
    console.error(">>> ORDER API ERROR:", err);
    return [];
  }
}
