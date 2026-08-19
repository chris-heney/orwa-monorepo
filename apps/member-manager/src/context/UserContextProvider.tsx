import React, { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import { useDataProvider, useNotify, Loading, Identifier } from 'react-admin';
import { IUser } from '../modules/human-resources/users/types';
import { CookieStore } from '../helpers/ra-strapi-data-provider';

/**
 * The current user comes from /users/me: every role can call it (unlike
 * users.findOne, which is admin-only) and the server attaches the role
 * object. Settings is the universal landing page, so this must never 403
 * for non-admins.
 */
const fetchMe = async (): Promise<IUser> => {
  const token = CookieStore.getCookie('token');

  const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/users/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch current user (status ${res.status})`);
  }

  return res.json();
};

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
      try {
        if (id) {
          // Explicit id = another user's linked account (admin-only pages
          // like EditHumanResource) — keep the users.findOne lookup.
          const { data } = await dataProvider.getOne<IUser>('users', {
            id: id as number,
          });
          setUser({ ...data });
        } else {
          setUser(await fetchMe());
        }
      } catch (error) {
        console.error('Error fetching user data', error);
        notify('An error occurred while fetching user data', { type: 'error' });
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
