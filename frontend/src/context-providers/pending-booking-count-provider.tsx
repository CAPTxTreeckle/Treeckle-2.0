import React from "react";
import { useGetPendingBookingCount } from "../custom-hooks/api";

type PendingBookingCountContextType = {
  pendingBookingCount: number;
  isLoading: boolean;
  getPendingBookingCount: () => Promise<number>;
};

export const PendingBookingCountContext = React.createContext<PendingBookingCountContextType>(
  {
    pendingBookingCount: 0,
    isLoading: false,
    getPendingBookingCount: () => {
      throw new Error("refreshPendingBookingCount not defined.");
    },
  },
);

type Props = {
  children: React.ReactNode;
};

function PendingBookingCountProvider({ children }: Props) {
  const {
    pendingCount,
    isLoading,
    getPendingBookingCount,
  } = useGetPendingBookingCount();

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
