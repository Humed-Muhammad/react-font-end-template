import { db } from "@/utils/pockatbase";
import type { AuthState, User } from "@/types";

export const useAuth = (): AuthState => {
  const user = db.authStore.record as unknown as User;

  return {
    user,
    isAuthenticated: !!user,
    loading: false,
  };
};
