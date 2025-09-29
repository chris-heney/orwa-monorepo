import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import { useAuthProvider } from "react-admin";
  
  interface IUserRoleContext {
    role: string | null;
    isLoading: boolean;
  }
  
  const UserRoleContext = createContext<IUserRoleContext>({
    role: null,
    isLoading: false,
  });
  
  export const useUserRoleContext = () => useContext(UserRoleContext);
  
  const UserRoleContextProvider = ({ children }: PropsWithChildren) => {
    const [role, setRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    const authProvider = useAuthProvider();
  
    useEffect(() => {
      const fetchUserRole = async () => {
        setIsLoading(true);
        try {
          const identity = await authProvider.getIdentity?.();
          if (identity?.role) {
            setRole(identity.role);
          } else {
            console.warn("User role not found in identity");
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUserRole();
    }, [authProvider]);
  
    return (
      <UserRoleContext.Provider value={{ role, isLoading }}>
        {children}
      </UserRoleContext.Provider>
    );
  };
  
  export default UserRoleContextProvider;