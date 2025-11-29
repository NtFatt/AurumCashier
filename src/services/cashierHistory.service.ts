import api from "@/lib/api";

export async function fetchCashierHistory() {
  const res = await api.get("/api/pos/history");
  return res.data.data;
}
