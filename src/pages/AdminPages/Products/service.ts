import { rootServiceApi } from "@/store/service";
import type { PaginatedResponse, Product, Stats } from "@/types";

interface Response extends PaginatedResponse<Product> {
  stats: Stats;
}
const productsService = rootServiceApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminProducts: build.query<Response, { page: number; perPage: number }>({
      query: (data) => ({
        url: "/products/admin",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useGetAdminProductsQuery } = productsService;
