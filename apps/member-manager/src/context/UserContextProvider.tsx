import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { useDataProvider, useNotify, Loading, Identifier } from "react-admin";
import { IUser } from "../modules/human-resources/users/types";
import authProvider from "../authProvider";

interface IUserContextProvider {
  user: any;
}

export const UserContext = createContext<IUserContextProvider>({
  user: {},
});

export const useUserContext = () => useContext(UserContext);

interface UserContextProviderProps {
  children: React.ReactNode;
  id?: Identifier;
}

const UserContextProvider = ({ children, id }: UserContextProviderProps) => {
  const [user, setUser] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const dataProvider = useDataProvider();

  const notify = useNotify();

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      const identity = await authProvider.getIdentity?.();

      if (!identity) {
        return;
      }
      try {
        await dataProvider
          .getOne<IUser>("users", {
            id: id ? id : identity.id as any,
          })
          .then(({ data }) => {
            const user = {
              ...data,
            };
            setUser(user);
          })
          .catch((error) => {
            console.error("Error fetching user data", error);
            notify("An error occurred while fetching user data", {
              type: "error",
            });
          });
      } catch (error) {
        console.error("Error fetching user data", error);
        notify("An error occurred while fetching user data", { type: "error" });
      }
    };

    fetchUser();
    setIsLoading(false);
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <UserContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
