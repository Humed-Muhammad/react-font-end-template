import type { User } from "@/types";

export type AuthState = {
  user: User | null;
  isFetchingUser: boolean;
};
