import { useMemo } from "react";
import { useLogoutIfAccessDenied } from "react-admin";
import { useQuery } from "@tanstack/react-query";
import authProvider from "../../authProvider";

const emptyParams = {};

/**
 * Hook for getting the current logged-in user
 *
 * Calls the authProvider.getIdentity() method using react-query.
 * If the authProvider returns a rejected promise, handles the error and logs out if access is denied.
 *
 * The return value updates according to the request state:
 *
 * - start: { isLoading: true }
 * - success: { user: [user data], isLoading: false }
 * - error: { error: [error from provider], isLoading: false }
 *
 * @param {Object} params Any params you want to pass to the authProvider
 *
 * @returns The current auth check state. Destructure as { user, error, isLoading, refetch }.
 *
 * @example
 *     import useCurrentUser from './useCurrentUser';
 *
 *     const SomeComponent = () => {
 *         const { isLoading, user } = useCurrentUser();
 *         if (isLoading) return <div>Loading...</div>;
 *         return <div>Welcome, {user.name}</div>;
 *     };
 */
const useCurrentUser = <User = any, Error = any>(
  params = emptyParams,
  queryParams: any = {
    staleTime: 5 * 60 * 1000,
  }
) => {
  const logoutIfAccessDenied = useLogoutIfAccessDenied();

  const result = useQuery<User, Error>({
    queryKey: ["auth", "getIdentity", params],
    queryFn: authProvider?.getIdentity
      ? async () => (await authProvider.getIdentity?.()) as User
      : async () => null as User,
    onError: (error) => {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      logoutIfAccessDenied(error);
    },
    ...queryParams,
  });

  return useMemo(
    () => ({
      user: { ...result.data, id: parseInt((result.data as any)?.id) } as User,
      role: (result.data as any)?.role,
      isLoading: result.isLoading,
      error: result.error,
      refetch: result.refetch,
    }),
    [result]
  );
};

export default useCurrentUser;

export interface User {
  id: number;
  email: string;
  role: string;
  token: string;
}
