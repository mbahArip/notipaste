import { Routes } from 'constant';
import { useRouter } from 'next/router';
import type { RecordModel } from 'pocketbase';
import { createContext, useContext, useEffect, useState } from 'react';

import cookieHelper from 'utils/cookiesHelper';
import pb from 'utils/pocketbase';

import { User } from 'types/Auth';

export interface AuthContextProps {
  user: User | null;
  setUserData: (user: RecordModel) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUserData: () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);
interface AuthProviderProps {
  children: React.ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const assignAuth = async () => {
      setIsLoading(true);
      pb.authStore.loadFromCookie(document.cookie);
      pb.authStore.isValid && (await pb.collection('notipaste_user').authRefresh());

      if (pb.authStore.isValid) {
        setUserData(pb.authStore.model as RecordModel);
      } else {
        logout();
      }
      setIsLoading(false);
    };

    assignAuth();

    // eslint-disable-next-line
  }, []);

  const setUserData = async (user: RecordModel) => {
    const { id, username, email, avatar, created, updated } = user;
    let avatarURL = avatar;
    if (!avatar.startsWith('http')) {
      avatarURL = pb.getFileUrl(user, avatar, { thumb: '100x100' });
    }
    setUser({
      id,
      username,
      email,
      avatar: avatarURL,
      collectionId: user.collectionId,
      collectionName: user.collectionName,
      created,
      updated,
    });
  };
  const logout = () => {
    setUser(null);
    pb.authStore.clear();
    cookieHelper.delete('pb_auth');
    if (router.pathname.startsWith(Routes.PROFILE)) {
      router.push(Routes.HOME);
    }
  };

  const value: AuthContextProps = {
    user,
    setUserData,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
