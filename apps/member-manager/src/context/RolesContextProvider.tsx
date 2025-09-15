import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { useDataProvider } from "react-admin";

interface IRolesContext {
  roles: any[];
  isLoading: boolean;
}

const RolesContext = createContext<IRolesContext>({
  roles: [],
  isLoading: false,
});

export const useRolesContext = () => useContext(RolesContext);

const RolesContextProvider = ({ children }: PropsWithChildren) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dataProvider = useDataProvider();

  // Fetch roles data on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const { data } = await dataProvider.getList("users-permissions/roles", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "name", order: "ASC" },
          meta: {
            raw: true,
          },
          filter: {},
        });
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [dataProvider]);

  return (
    <RolesContext.Provider value={{ roles, isLoading }}>
      {children}
    </RolesContext.Provider>
  );
};

export default RolesContextProvider;