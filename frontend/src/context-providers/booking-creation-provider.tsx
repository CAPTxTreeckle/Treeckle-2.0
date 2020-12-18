import React, { useCallback, useState } from "react";
import { VenueViewProps } from "../types/venues";

export enum BookingCreationStep {
  Category = 0,
  Venue,
  TimeSlot,
  Form,
  Finalize,
  __length,
}

export const undoableBookingCreationSteps = [
  BookingCreationStep.Venue,
  BookingCreationStep.TimeSlot,
  BookingCreationStep.Form,
  BookingCreationStep.Finalize,
];

type BookingCreationContextType = {
  currentCreationStep: BookingCreationStep;
  goToNextStep: (data: unknown) => void;
  goToPreviousStep: () => void;
  selectedCategory?: string;
  selectedVenue?: VenueViewProps;
};

export const BookingCreationContext = React.createContext<BookingCreationContextType>(
  {
    currentCreationStep: BookingCreationStep.Category,
    goToNextStep: () => {
      throw new Error("goToNextStep not defined.");
    },
    goToPreviousStep: () => {
      throw new Error("goToPreviousStep not defined.");
    },
  },
);

type Props = {
  children: React.ReactNode;
};

function BookingCreationProvider({ children }: Props) {
  const [currentCreationStep, setCurrentCreationStep] = useState(
    BookingCreationStep.Category,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedVenue, setSelectedVenue] = useState<VenueViewProps>();

  const goToNextStep = useCallback(
    (data: unknown) => {
      if (currentCreationStep === BookingCreationStep.Finalize) {
        return;
      }

      switch (currentCreationStep) {
        case BookingCreationStep.Category:
          setSelectedCategory(data as string);
          setCurrentCreationStep(BookingCreationStep.Venue);
          return;
        case BookingCreationStep.Venue:
          setSelectedVenue(data as VenueViewProps);
          setCurrentCreationStep(BookingCreationStep.TimeSlot);
          return;
      }

      setCurrentCreationStep(currentCreationStep + 1);
    },
    [currentCreationStep],
  );

  const goToPreviousStep = useCallback(() => {
    if (!undoableBookingCreationSteps.includes(currentCreationStep)) {
      return;
    }

    switch (currentCreationStep) {
      case BookingCreationStep.Venue:
        setSelectedCategory(undefined);
        setCurrentCreationStep(BookingCreationStep.Category);
        return;
      case BookingCreationStep.TimeSlot:
        setSelectedVenue(undefined);
        setCurrentCreationStep(BookingCreationStep.Venue);
        return;
    }

    setCurrentCreationStep(currentCreationStep - 1);
  }, [currentCreationStep]);

  return (
    <BookingCreationContext.Provider
      value={{
        currentCreationStep,
        goToNextStep,
        goToPreviousStep,
        selectedCategory,
        selectedVenue,
      }}
    >
      {children}
    </BookingCreationContext.Provider>
  );
}

export default BookingCreationProvider;
