import React, { useEffect } from "react";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Loading, useDataProvider, useStore } from "react-admin";
import { IUser } from "../human-resources/users/types";

export type TabValue = "contacts" | "user";

export interface ISettingsContextProvider {
  selectedTab: TabValue;
  setSelectedTab: React.Dispatch<React.SetStateAction<TabValue>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  roles: any[];
  //  return a IContact object
  fetchContact: (user: IUser) => Promise<any>;
}

export const SettingsContext = createContext<ISettingsContextProvider>({
  selectedTab: "contacts",
  setSelectedTab: () => {},
  isLoading: true,
  setIsLoading: () => {},
  roles: [],
  fetchContact: async () => {},
});

export const useSettingsContext = () => useContext(SettingsContext);

const SettingsContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useStore<TabValue>("contact", "user");
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<any[]>([]);
  const dataProvider = useDataProvider();

  useEffect(() => {
    setIsLoading(true);
    const fetchRoles = async () => {
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
        console.log("error", error);
      }
    };

    fetchRoles();
    setIsLoading(false);
  }, []);

  const fetchContact = async (user: IUser) => {
    try {
      const { data: contacts } = await dataProvider.getList("contacts", {
        pagination: { page: 1, perPage: 5000 },
        sort: { field: "id", order: "DESC" },
        meta: {
          raw: true,
        },
        filter: { user: user.id },
      });
      return contacts[0];
    } catch (error) {
      console.log("error", error);
    }
  };

  if (isLoading ) {
    return <Loading />;
  }

  return (
    <SettingsContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        isLoading,
        setIsLoading,
        roles,
        fetchContact
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContextProvider;
