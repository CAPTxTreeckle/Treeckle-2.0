import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers";
import { Form } from "semantic-ui-react";
import TimeFormField from "../time-form-field";
import StepLayout from "../create-booking-requests-step-layout";
import { CreateBookingRequestContext } from "../../context-providers/create-booking-request-provider";
import RadioFormField from "../radio-form-field";
import "./create-booking-request-time.scss";

interface CreateBookingRequestTimeFormData {
  startTime: Date;
  endTime: Date;
  isOvernight: boolean;
}

const schema = yup.object().shape({
  startTime: yup
    .date()
    .required("Please enter the booking start time")
    .typeError("Please enter the booking start time"),
  endTime: yup
    .date()
    .when(
      ["startTime", "isOvernight"],
      (
        startDateTime: Date,
        isOvernight: boolean,
        schema: yup.DateSchema<Date, unknown>,
      ) =>
        !isOvernight && dayjs(startDateTime).isValid()
          ? schema.min(
              startDateTime,
              "The booking start time cannot be after the end time",
            )
          : schema,
    )
    .required("Please enter the booking end time")
    .typeError("Please enter the booking end time"),
});

function BookingRequestTimeStep() {
  const { bookingRequestData, setBookingRequestData } = useContext(
    CreateBookingRequestContext,
  );

  const defaultValues: CreateBookingRequestTimeFormData = {
    startTime: bookingRequestData.startTime,
    endTime: bookingRequestData.endTime,
    isOvernight: bookingRequestData.isOvernight,
  };

  const methods = useForm<CreateBookingRequestTimeFormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { handleSubmit } = methods;

  function onClickTimeInput() {
    // workaround to set a higher z-index than the dimmed content behind the modal
    const container = document.querySelector(
      ".ui.flowing.popup.transition.visible.scale.visible.transition",
    )?.parentElement;
    if (container) {
      container.className = "time-picker-container";
    }
  }

  async function submitTime() {
    let shouldGoToNextStep = true;
    await handleSubmit(
      (data) => {
        setBookingRequestData({
          ...bookingRequestData,
          startTime: data.startTime,
          endTime: data.endTime,
          isOvernight: data.isOvernight,
        });
      },
      () => {
        shouldGoToNextStep = false;
      },
    )();
    return shouldGoToNextStep;
  }

  return (
    <StepLayout onNextStep={submitTime}>
      <FormProvider {...methods}>
        <Form className="create-booking-request-time-container">
          <TimeFormField
            inputName="startTime"
            label="Start Time"
            onClick={onClickTimeInput}
            required
          />
          <TimeFormField
            inputName="endTime"
            label="End Time"
            onClick={onClickTimeInput}
            required
          />
          <RadioFormField
            inputName="isOvernight"
            type="toggle"
            label="Overnight Booking"
          />
        </Form>
      </FormProvider>
    </StepLayout>
  );
}

export default BookingRequestTimeStep;
