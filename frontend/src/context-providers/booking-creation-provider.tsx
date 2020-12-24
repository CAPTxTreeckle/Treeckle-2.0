import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import BookingCreationCategorySelector from "../components/booking-creation-category-selector";
import BookingCreationCustomForm from "../components/booking-creation-custom-form";
import BookingCreationFinalizedView from "../components/booking-creation-finalized-view";
import BookingCreationTimeSlotSelector from "../components/booking-creation-time-slot-selector";
import BookingCreationVenueSelector from "../components/booking-creation-venue-selector";
import {
  DATE_TIME_RANGES,
  FORM_RESPONSE_DATA,
  RESPONSE,
  TITLE,
  VENUE_ID,
} from "../constants";
import { useCreateBookings } from "../custom-hooks/api";
import { CalendarBooking } from "../custom-hooks/use-booking-creation-calendar-state";
import {
  BookingFormProps,
  CustomVenueBookingFormData,
  DateTimeRange,
} from "../types/bookings";
import { FieldType, VenueViewProps } from "../types/venues";
import { resolveApiError } from "../utils/error-utils";

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
  goToPreviousStep: (data: unknown) => void;
  selectedCategory?: string;
  selectedVenue?: VenueViewProps;
  newBookingDateTimeRanges: DateTimeRange[];
  bookingTitle: string;
  bookingFormData: CustomVenueBookingFormData[];
  isSubmitting: boolean;
  hasCreatedBookings: boolean;
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
    bookingTitle: "",
    bookingFormData: [],
    isSubmitting: false,
    hasCreatedBookings: false,
  },
);

type Props = {
  children: React.ReactNode;
};

function BookingCreationProvider({ children }: Props) {
  const {
    isLoading: isSubmitting,
    createBookings: _createBookings,
  } = useCreateBookings();

  const [currentCreationStep, setCurrentCreationStep] = useState(
    BookingCreationStep.Category,
  );
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedVenue, setSelectedVenue] = useState<VenueViewProps>();
  const [newBookingDateTimeRanges, setNewBookingDateTimeRanges] = useState<
    DateTimeRange[]
  >([]);
  const [bookingTitle, setBookingTitle] = useState("");
  const [bookingFormData, setBookingFormData] = useState<
    CustomVenueBookingFormData[]
  >([]);
  const [hasCreatedBookings, setHasCreatedBookings] = useState(false);

  const createBookings = useCallback(async () => {
    if (selectedVenue === undefined) {
      return;
    }

    try {
      await _createBookings({
        [TITLE]: bookingTitle,
        [VENUE_ID]: selectedVenue.id,
        [DATE_TIME_RANGES]: newBookingDateTimeRanges,
        [FORM_RESPONSE_DATA]: bookingFormData,
      });

      toast.success("New booking(s) created successfully.");
      setHasCreatedBookings(true);
    } catch (error) {
      resolveApiError(error);
    }
  }, [
    _createBookings,
    selectedVenue,
    bookingTitle,
    newBookingDateTimeRanges,
    bookingFormData,
  ]);

  useEffect(() => {
    setNewBookingDateTimeRanges([]);

    setBookingTitle("");

    const newFormData =
      selectedVenue?.venueFormProps.customVenueBookingFormFields?.map(
        (field) => ({
          ...field,
          [RESPONSE]: field.fieldType === FieldType.Boolean ? false : "",
        }),
      ) ?? [];

    setBookingFormData(newFormData);
  }, [selectedVenue]);

  const updateBookingTitleAndFormData = useCallback(
    (bookingFormProps: BookingFormProps) => {
      const { title, customVenueBookingFormResponses } = bookingFormProps;

      setBookingTitle(title);

      setBookingFormData(
        (bookingFormData) =>
          customVenueBookingFormResponses?.map(({ response }, index) => ({
            ...bookingFormData[index],
            response,
          })) ?? [],
      );
    },
    [],
  );

  const goToNextStep = useCallback(
    (data: unknown) => {
      if (hasCreatedBookings || isSubmitting) {
        return;
      }

      if (currentCreationStep === BookingCreationStep.Finalize) {
        createBookings();
        return;
      }

      switch (currentCreationStep) {
        case BookingCreationStep.Category:
          setSelectedCategory(data as string);
          break;
        case BookingCreationStep.Venue:
          setSelectedVenue(data as VenueViewProps);
          break;
        case BookingCreationStep.TimeSlot:
          setNewBookingDateTimeRanges(
            (data as CalendarBooking[]).map(({ start, end }) => ({
              startDateTime: start.getTime(),
              endDateTime: end.getTime(),
            })),
          );
          break;
        case BookingCreationStep.Form:
          updateBookingTitleAndFormData(data as BookingFormProps);
          break;
      }

      setCurrentCreationStep(currentCreationStep + 1);
    },
    [
      currentCreationStep,
      updateBookingTitleAndFormData,
      isSubmitting,
      hasCreatedBookings,
      createBookings,
    ],
  );

  const goToPreviousStep = useCallback(
    (data?: unknown) => {
      if (
        hasCreatedBookings ||
        isSubmitting ||
        !undoableBookingCreationSteps.includes(currentCreationStep)
      ) {
        return;
      }

      switch (currentCreationStep) {
        case BookingCreationStep.Venue:
          setSelectedCategory(undefined);
          break;
        case BookingCreationStep.TimeSlot:
          setSelectedVenue(undefined);
          break;
        case BookingCreationStep.Form:
          updateBookingTitleAndFormData(data as BookingFormProps);
          break;
      }

      setCurrentCreationStep(currentCreationStep - 1);
    },
    [
      currentCreationStep,
      updateBookingTitleAndFormData,
      isSubmitting,
      hasCreatedBookings,
    ],
  );

  return (
    <BookingCreationContext.Provider
      value={{
        currentCreationStep,
        goToNextStep,
        goToPreviousStep,
        selectedCategory,
        selectedVenue,
        newBookingDateTimeRanges,
        bookingTitle,
        bookingFormData,
        isSubmitting,
        hasCreatedBookings,
      }}
    >
      {children}
    </BookingCreationContext.Provider>
  );
}

export default BookingCreationProvider;
