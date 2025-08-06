import { authReducer } from "@/pages/Auth/slice";
import { configureStore } from "@reduxjs/toolkit";
import { rootServiceApi } from "./service";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [rootServiceApi.reducerPath]: rootServiceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(rootServiceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
