import React, { useCallback, useState } from "react";
import BookingCreationCategorySelector from "../components/booking-creation-category-selector";
import BookingCreationCustomForm from "../components/booking-creation-custom-form";
import BookingCreationFinalizedView from "../components/booking-creation-finalized-view";
import BookingCreationTimeSlotSelector from "../components/booking-creation-time-slot-selector";
import BookingCreationVenueSelector from "../components/booking-creation-venue-selector";
import { CalendarBooking } from "../custom-hooks/use-booking-creation-calendar-state";
import { DateTimeRange } from "../types/bookings";
import { VenueViewProps } from "../types/venues";

export enum BookingCreationStep {
  Category = 0,
  Venue,
  TimeSlot,
  Form,
  Finalize,
  __length,
}

export const bookingCreationStepHeaders = [
  "Step 1: Choose a venue category",
  "Step 2: Select a venue",
  "Step 3: Select your booking period(s)",
  "Step 4: Complete the booking form",
  "Step 5: Review & submit",
];

export const bookingCreationStepComponents = [
  <BookingCreationCategorySelector />,
  <BookingCreationVenueSelector />,
  <BookingCreationTimeSlotSelector />,
  <BookingCreationCustomForm />,
  <BookingCreationFinalizedView />,
];

const undoableBookingCreationSteps = [
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
  newBookingDateTimeRanges: DateTimeRange[];
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
    newBookingDateTimeRanges: [],
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
  const [newBookingDateTimeRanges, setNewBookingDateTimeRanges] = useState<
    DateTimeRange[]
  >([]);

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
        case BookingCreationStep.TimeSlot:
          setNewBookingDateTimeRanges(
            (data as CalendarBooking[]).map(({ start, end }) => ({
              startDateTime: start.getTime(),
              endDateTime: end.getTime(),
            })),
          );
          setCurrentCreationStep(BookingCreationStep.Form);
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
        setNewBookingDateTimeRanges([]);
        setCurrentCreationStep(BookingCreationStep.Venue);
        return;
      case BookingCreationStep.Form:
        setCurrentCreationStep(BookingCreationStep.TimeSlot);
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
        newBookingDateTimeRanges,
      }}
    >
      {children}
    </BookingCreationContext.Provider>
  );
}

export default BookingCreationProvider;
