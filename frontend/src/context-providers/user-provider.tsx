import React, { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@rehooks/local-storage";
import isEqual from "lodash.isequal";
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
  updateUser: (user: User | null) => void;
};

export const UserContext = React.createContext<UserContextType>({
  updateUser: () => {
    throw new Error("updateUser is not defined.");
  },
});

type Props = {
  children: React.ReactNode;
};

function UserProvider({ children }: Props) {
  const [user, setUser, deleteUser] = useLocalStorage<User>("user");
  const [_user, _setUser] = useState<User | null>(user);

  const updateUser = useCallback(
    (updatedUser: User | null) => {
      updatedUser ? setUser({ ..._user, ...updatedUser }) : deleteUser();
    },
    [_user, setUser, deleteUser],
  );

  // required to prevent multiple changes to user
  useEffect(() => {
    _setUser((_user) => {
      return isEqual(user, _user) ? _user : user;
    });
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        id: _user?.id,
        name: _user?.name,
        email: _user?.email,
        role: _user?.role,
        organization: _user?.organization,
        accessToken: _user?.accessToken,
        refreshToken: _user?.refreshToken,
        profilePic: _user?.profilePic,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
