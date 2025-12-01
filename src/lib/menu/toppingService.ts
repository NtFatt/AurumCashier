import api from "@/lib/api";

export const ToppingService = {
  async getAll() {
    const res = await api.get("/api/toppings");

    if (!res.data || !Array.isArray(res.data.data)) {
      console.error("❌ Dữ liệu topping không hợp lệ:", res.data);
      return [];
    }

    return res.data.data; // ✔ LẤY ĐÚNG ARRAY
  },
};
