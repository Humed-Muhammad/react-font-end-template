import { rootServiceApi } from "@/store/service";
import type { PaginatedResponse, Product } from "@/types";

const productsService = rootServiceApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminProducts: build.query<
      PaginatedResponse<Product>,
      { page: number; perPage: number }
    >({
      query: (data) => ({
        url: "/products/admin",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useGetAdminProductsQuery } = productsService;
