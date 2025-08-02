import type { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";

const rootAuthState = (state: RootState) => state.auth;

export const selectUser = createSelector(rootAuthState, (auth) => auth.user);
export const selectIsFetchingUser = createSelector(
  rootAuthState,
  (auth) => auth.isFetchingUser
);
