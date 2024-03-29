import React from "react";
import { useGetVenues } from "../custom-hooks/api";
import { VenueViewProps } from "../types/venues";

type VenuesContextType = {
  venues: VenueViewProps[];
  getVenues: () => Promise<VenueViewProps[]>;
  isLoading: boolean;
};

export const VenuesContext = React.createContext<VenuesContextType>({
  venues: [],
  getVenues: () => {
    throw new Error("getVenues not defined.");
  },
  isLoading: false,
});

type Props = {
  children: React.ReactNode;
};

function VenuesProvider({ children }: Props) {
  const { venues, isLoading, getVenues } = useGetVenues();

  return (
    <VenuesContext.Provider value={{ venues, isLoading, getVenues }}>
      {children}
    </VenuesContext.Provider>
  );
}

export default VenuesProvider;
