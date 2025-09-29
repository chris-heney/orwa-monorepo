import { useState, useEffect } from "react";
import { IUserIdentity } from "../authProvider";
import Cookies from "./Cookies";


export const useGetIdentity = (): IUserIdentity | null => {
  const [identity, setIdentity] = useState<IUserIdentity | null>(null);

  useEffect(() => {
    const fetchIdentity = async () => {
      try {
        const user = {
          email: Cookies.getCookie("email") as string,
          role: Cookies.getCookie("role") as string,
          id: Cookies.getCookie("id") as string,
          token: Cookies.getCookie("token") as string,
        };
        setIdentity(user);
      } catch (error) {
        console.error("❌ Error fetching identity:", error);
        setIdentity(null);
      }
    };

    fetchIdentity();
  }, []);

  return identity;
};