import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { Button, Form, Segment, Ref } from "semantic-ui-react";
import { BookingCreationContext } from "../../context-providers";
import {
  BookingFormProps,
  CustomVenueBookingFormResponseProps,
} from "../../types/bookings";
import {
  CUSTOM_VENUE_BOOKING_FORM_RESPONSES,
  RESPONSE,
  TITLE,
} from "../../constants";
import FormField from "../form-field";
import CustomFormFieldRenderer from "../custom-form-field-renderer";
import { FieldType } from "../../types/venues";
import { deepTrim } from "../../utils/parser-utils";

const schema = yup.object().shape({
  [TITLE]: yup.string().trim().required("Please enter a short booking title"),
  [CUSTOM_VENUE_BOOKING_FORM_RESPONSES]: yup
    .array(
      yup
        .object()
        .shape({
          [RESPONSE]: yup.mixed<string | boolean>().notRequired(),
        })
        .required(),
    )
    .notRequired(),
});

function BookingCreationCustomForm() {
  const {
    goToNextStep,
    goToPreviousStep,
    bookingTitle,
    bookingFormData,
  } = useContext(BookingCreationContext);
  const formRef = useRef<HTMLFormElement>(null);

  const defaultValues: BookingFormProps = useMemo(() => {
    return {
      [TITLE]: bookingTitle,
      [CUSTOM_VENUE_BOOKING_FORM_RESPONSES]: bookingFormData.map(
        ({ response }) => ({
          response,
        }),
      ),
    };
  }, [bookingTitle, bookingFormData]);

  const methods = useForm<BookingFormProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { handleSubmit, control, setError, reset, getValues } = methods;
  const { fields } = useFieldArray<CustomVenueBookingFormResponseProps>({
    control,
    name: CUSTOM_VENUE_BOOKING_FORM_RESPONSES,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const onSubmit = useCallback(
    (formData: BookingFormProps) => {
      // TODO: use yup to validate custom required field
      // Currently, idk how to integrate the above :(
      // manual validating custom required fields
      const trimmedFormData = deepTrim(formData);
      const { customVenueBookingFormResponses } = trimmedFormData;

      let hasError = false;
      customVenueBookingFormResponses?.forEach(({ response }, index) => {
        const { fieldType, requiredField } = bookingFormData[index];

        if (fieldType === FieldType.Boolean || !requiredField || response) {
          return;
        }

        setError(
          `${CUSTOM_VENUE_BOOKING_FORM_RESPONSES}[${index}].${RESPONSE}`,
          {
            type: "required",
            message: "This field is required",
            shouldFocus: !hasError,
          },
        );

        hasError = true;
      });

      !hasError && goToNextStep(trimmedFormData);
    },
    [setError, bookingFormData, goToNextStep],
  );

  return (
    <>
      <Segment padded="very">
        <FormProvider {...methods}>
          <Ref innerRef={formRef}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormField inputName={TITLE} label="Booking Title" required />

              {fields.map(({ id, response }, index) => (
                <CustomFormFieldRenderer
                  key={id}
                  inputName={`${CUSTOM_VENUE_BOOKING_FORM_RESPONSES}[${index}].${RESPONSE}`}
                  {...bookingFormData[index]}
                  defaultValue={
                    response ??
                    (bookingFormData[index].fieldType === FieldType.Boolean
                      ? false
                      : "")
                  }
                />
              ))}
            </Form>
          </Ref>
        </FormProvider>
      </Segment>

      <Segment secondary>
        <div className="action-container justify-end">
          <Button
            color="black"
            content="Back"
            onClick={() => goToPreviousStep(deepTrim(getValues()))}
          />
          <Button
            color="blue"
            content="Next"
            onClick={() => formRef.current?.dispatchEvent(new Event("submit"))}
          />
        </div>
      </Segment>
    </>
  );
}

export default BookingCreationCustomForm;
