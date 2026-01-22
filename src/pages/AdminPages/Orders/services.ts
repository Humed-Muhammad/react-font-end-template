import { rootServiceApi } from "@/store/service";
import type { Order } from "@/types";

type Orders = {
  items: Order[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
};
export const orderServices = rootServiceApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<Orders, { page: number; perPage: number }>({
      query: (params) => ({
        url: "/orders",
        method: "GET",
        params,
      }),
    }),
    getOrder: build.query<Order, { orderId: string }>({
      query: (params) => ({
        url: `/orders/${params.orderId}`,
        method: "GET",
      }),
    }),
    createOrder: build.mutation<Order, unknown>({
      query: (order) => ({
        url: "/orders/create",
        method: "POST",
        data: order,
      }),
    }),
    updateOrder: build.mutation<Order, { orderId: string; order: unknown }>({
      query: (params) => ({
        url: `/orders/${params.orderId}`,
        method: "PUT",
        data: params.order,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} = orderServices;
