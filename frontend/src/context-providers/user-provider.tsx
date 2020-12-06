import React, { useCallback } from "react";
import { useLocalStorage } from "@rehooks/local-storage";
import { Role } from "../types/users";

export type User = {
  id?: number;
  name?: string;
  email?: string;
  role?: Role;
  organization?: string;
  accessToken?: string;
  refreshToken?: string;
  profilePic?: string;
};

type UserContextType = User & {
  setUser: (user: User | null) => void;
};

export const UserContext = React.createContext<UserContextType>({
  setUser: () => {
    throw new Error("setUser is not defined.");
  },
});

type Props = {
  children: React.ReactNode;
};

function UserProvider({ children }: Props) {
  const [user, setUser, deleteUser] = useLocalStorage<User>("user");

  const _setUser = useCallback(
    (updatedUser: User | null) =>
      updatedUser ? setUser({ ...user, ...updatedUser }) : deleteUser(),
    [user, setUser, deleteUser],
  );

  return (
    <UserContext.Provider
      value={{
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        organization: user?.organization,
        accessToken: user?.accessToken,
        refreshToken: user?.refreshToken,
        profilePic: user?.profilePic,
        setUser: _setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
