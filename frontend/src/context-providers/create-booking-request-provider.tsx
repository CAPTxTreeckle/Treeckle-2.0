import React, { Dispatch, SetStateAction, useState } from "react";

export type CreateBookingRequestData = {
  venueId: number;
  venueName: string;
  startTime: Date;
  endTime: Date;
  isOvernight: boolean;
  dates: Date[];
  formData: Record<string, string | number>;
};

export enum CreateBookingRequestSteps {
  VENUE = 0,
  TIME = 1,
  DATE = 2,
  FORM = 3,
  COMPLETED = 4,
}

export const CreateBookingRequestStepsOrder = [
  CreateBookingRequestSteps.VENUE,
  CreateBookingRequestSteps.TIME,
  CreateBookingRequestSteps.DATE,
  CreateBookingRequestSteps.FORM,
  CreateBookingRequestSteps.COMPLETED,
];

export const CreateBookingRequestStepsHeaders = [
  "Step 1: Choose a venue",
  "Step 2: Select your timeslot",
  "Step 3: Select your date(s)",
  "Step 4: Complete the booking form",
  "Step 5: Review & submit",
];

type CreateBookingRequestContextType = {
  bookingRequestData: CreateBookingRequestData;
  setBookingRequestData:
    | Dispatch<SetStateAction<CreateBookingRequestData>>
    | (() => never);
  currentStep: CreateBookingRequestSteps;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetCreateBookingRequestContext: () => void;
};

const defaultBookingRequestData = {
  venueId: -1,
  venueName: "",
  startTime: new Date(),
  endTime: new Date(),
  isOvernight: false,
  dates: [],
  formData: {},
};

const defaultContext = {
  bookingRequestData: defaultBookingRequestData,
  setBookingRequestData: () => {
    throw new Error("setBookingRequestdata is undefined");
  },
  currentStep: CreateBookingRequestStepsOrder[0],
  goToNextStep: () => {
    throw new Error("goToNextStep is undefined");
  },
  goToPreviousStep: () => {
    throw new Error("goToPreviousStep is undefined");
  },
  resetCreateBookingRequestContext: () => {
    throw new Error("resetCreateBookingRequest is undefined");
  },
};

export const CreateBookingRequestContext = React.createContext<
  CreateBookingRequestContextType
>(defaultContext);

type Props = {
  children: React.ReactNode;
};

function CreateBookingRequestProvider({ children }: Props) {
  const [bookingRequestData, setBookingRequestData] = useState<
    CreateBookingRequestData
  >(defaultBookingRequestData);

  const [currentStep, setCurrentStep] = useState<CreateBookingRequestSteps>(
    defaultContext.currentStep,
  );

  function goToNextStep() {
    if (
      currentStep ===
      CreateBookingRequestStepsOrder[CreateBookingRequestStepsOrder.length - 1]
    ) {
      throw new Error("This is the final step");
    }

    setCurrentStep(
      CreateBookingRequestStepsOrder[
        CreateBookingRequestStepsOrder.indexOf(currentStep) + 1
      ],
    );
  }

  function goToPreviousStep() {
    if (currentStep === 0) {
      throw new Error("This is the first step");
    }

    setCurrentStep(
      CreateBookingRequestStepsOrder[
        CreateBookingRequestStepsOrder.indexOf(currentStep) - 1
      ],
    );
  }

  function resetCreateBookingRequestContext() {
    setBookingRequestData(defaultBookingRequestData);
    setCurrentStep(defaultContext.currentStep);
  }

  return (
    <CreateBookingRequestContext.Provider
      value={{
        bookingRequestData,
        setBookingRequestData,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        resetCreateBookingRequestContext,
      }}
    >
      {children}
    </CreateBookingRequestContext.Provider>
  );
}

export default CreateBookingRequestProvider;
