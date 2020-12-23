import React, { useCallback, useContext, useState } from "react";
import { useGetPendingBookingCount } from "../custom-hooks/api";
import { Role } from "../types/users";
import { UserContext } from "./user-provider";

type GetPendingBookingCountConfig = {
  showLoading?: boolean;
};

type PendingBookingCountContextType = {
  pendingBookingCount: number;
  isLoading: boolean;
  getPendingBookingCount: (
    config?: GetPendingBookingCountConfig,
  ) => Promise<number>;
};

export const PendingBookingCountContext = React.createContext<PendingBookingCountContextType>(
  {
    pendingBookingCount: 0,
    isLoading: false,
    getPendingBookingCount: () => {
      throw new Error("getPendingBookingCount not defined.");
    },
  },
);

type Props = {
  children: React.ReactNode;
};

function PendingBookingCountProvider({ children }: Props) {
  const { role } = useContext(UserContext);
  const {
    pendingCount,
    getPendingBookingCount: _getPendingBookingCount,
  } = useGetPendingBookingCount();
  const [isLoading, setLoading] = useState(false);

  const getPendingBookingCount = useCallback(
    async ({ showLoading = true }: GetPendingBookingCountConfig = {}) => {
      showLoading && setLoading(true);
      const pendingBookingCount =
        role === Role.Admin ? await _getPendingBookingCount() : 0;
      showLoading && setLoading(false);

      return pendingBookingCount;
    },
    [_getPendingBookingCount, role],
  );

  return (
    <PendingBookingCountContext.Provider
      value={{
        pendingBookingCount: pendingCount,
        isLoading,
        getPendingBookingCount,
      }}
    >
      {children}
    </PendingBookingCountContext.Provider>
  );
}

export default PendingBookingCountProvider;
