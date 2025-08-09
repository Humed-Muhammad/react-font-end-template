import { rootServiceApi } from "@/store/service";
import type {
  PaginatedResponse,
  Product,
  ProductCategory,
  Stats,
} from "@/types";

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
    getProductCategories: build.query<ProductCategory[], void>({
      query: () => ({
        url: "/product-categories",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAdminProductsQuery, useGetProductCategoriesQuery } =
  productsService;
