import { createContext, useContext, useState } from "react";
import {
    payOrder,
    fetchCashierOrders,
    fetchBaristaOrders
} from "@/services/orderWorkflow";

export interface OrderType {
    id: number;
    orderNumber: number;
    status: string;
    items: any[];
    total: number;
    time: Date | string;
    type?: string;
    cashier?: string;
    paymentMethod?: string;
}

interface OrderContextType {
    orders: OrderType[];
    cashierOrders: OrderType[];
    baristaOrders: OrderType[];
    historyOrders: OrderType[];

    refreshOrders: () => Promise<void>;
    completePayment: (orderId: number, paymentMethod: string, customerPaid: number) => Promise<void>;
}

const OrderContext = createContext<OrderContextType>({
    orders: [],
    cashierOrders: [],
    baristaOrders: [],
    historyOrders: [],

    refreshOrders: async () => {},
    completePayment: async () => {},
});

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [cashierOrders, setCashierOrders] = useState<OrderType[]>([]);
    const [baristaOrders, setBaristaOrders] = useState<OrderType[]>([]);
    const [historyOrders, setHistoryOrders] = useState<OrderType[]>([]);

    const refreshOrders = async () => {
        try {
            const [cashier, barista] = await Promise.all([
                fetchCashierOrders(),
                fetchBaristaOrders()
            ]);

            const posActive = cashier
                .filter(o => o.status !== "completed")
                .map(o => ({
                    id: o.id,
                    orderNumber: o.orderNumber,
                    total: o.total,
                    items: o.items,
                    status: o.status,
                    time: o.createdAt,
                    type: "pos",
                    cashier: o.customerName,
                    paymentMethod: o.paymentMethod
                }));

            const posHistory = cashier
                .filter(o => o.status === "completed")
                .map(o => ({
                    id: o.id,
                    orderNumber: o.orderNumber,
                    total: o.total,
                    items: o.items,
                    status: "completed",
                    time: o.createdAt,
                    type: "history",
                    cashier: o.customerName,
                    paymentMethod: o.paymentMethod
                }));

            const baristaList = barista.map(o => ({
                id: o.id,
                orderNumber: o.orderNumber,
                total: o.total,
                items: o.items,
                status: o.status,
                time: o.createdAt,
                type: "barista",
                cashier: "Barista",
            }));

            setCashierOrders(posActive);
            setBaristaOrders(baristaList);
            setHistoryOrders(posHistory);
            setOrders([...posActive, ...baristaList, ...posHistory]);

        } catch (error) {
            console.error("refreshOrders error:", error);
        }
    };

    const completePayment = async (orderId: number, paymentMethod: string, customerPaid: number) => {
        await payOrder(orderId, paymentMethod, customerPaid);
        await refreshOrders();
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                cashierOrders,
                baristaOrders,
                historyOrders,
                refreshOrders,
                completePayment,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
