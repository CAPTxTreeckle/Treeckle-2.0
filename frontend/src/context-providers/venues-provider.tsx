import React from "react";
import { useGetAllVenues } from "../custom-hooks/api";
import { VenueViewProps } from "../types/venues";

type VenuesContextType = {
  venues: VenueViewProps[];
  getAllVenues: () => Promise<VenueViewProps[]>;
  isLoading: boolean;
};

export const VenuesContext = React.createContext<VenuesContextType>({
  venues: [],
  getAllVenues: () => {
    throw new Error("getAllVenues not defined");
  },
  isLoading: false,
});

type Props = {
  children: React.ReactNode;
};

function VenuesProvider({ children }: Props) {
  const { venues, isLoading, getAllVenues } = useGetAllVenues();

  return (
    <VenuesContext.Provider value={{ venues, isLoading, getAllVenues }}>
      {children}
    </VenuesContext.Provider>
  );
}

export default VenuesProvider;
