import { db } from "@/utils/pockatbase";
import type { User } from "@/types";
import { useEffect } from "react";
import { useAuthSlice } from "@/pages/Auth/slice";

export const useAuth = () => {
  const localUser = db.authStore.record as unknown as User;
  const { isFetchingUser, actions, user, dispatch } = useAuthSlice();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(actions.setFetchingUser(true));
        if (localUser.id) {
          const record = (await db
            .collection("users")
            .getOne(localUser.id)) as User;
          dispatch(actions.setUser(record));
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(actions.setFetchingUser(false));
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localUser.id]);

  return {
    user,
    isAuthenticated: !!user,
    isFetchingUser,
  };
};
