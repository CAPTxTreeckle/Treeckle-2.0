import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Form,
  Grid,
  Header,
  Segment,
  StrictButtonProps,
} from "semantic-ui-react";
import {
  IS_SIGN_UP_ALLOWED,
  CATEGORIES,
  DESCRIPTION,
  END_DATE_TIME,
  TITLE,
  IMAGE,
  ORGANIZED_BY,
  IS_PUBLISHED,
  CAPACITY,
  IS_SIGN_UP_APPROVAL_REQUIRED,
  START_DATE_TIME,
  VENUE_NAME,
} from "../../constants";
import { useAllowSignUp } from "../../custom-hooks";
import { EventFormProps } from "../../types/events";
import FormField from "../form-field";
import ImageUploadCropper from "../image-upload-cropper";
import RadioFormField from "../radio-form-field";
import TextAreaFormField from "../text-area-form-field";
import DropdownSelectorFormField from "../dropdown-selector-form-field";
import { useGetEventCategories } from "../../custom-hooks/api";
import DateTimeFormField from "../date-time-form-field";
import "./event-details-form.scss";
import { deepTrim } from "../../utils/parser-utils";

const schema = yup.object().shape({
  [TITLE]: yup.string().trim().required("Please enter an event title"),
  [ORGANIZED_BY]: yup.string().trim().required("Please enter an organizer"),
  [VENUE_NAME]: yup.string().trim().notRequired(),
  [CATEGORIES]: yup.array(yup.string().trim().required()).notRequired(),
  [CAPACITY]: yup
    .number()
    .positive("Capacity must be positive")
    .integer("Capacity must be an integer")
    .transform((value, originalValue) =>
      typeof originalValue === "string" && originalValue === "" ? null : value,
    )
    .nullable(),
  [START_DATE_TIME]: yup
    .number()
    .integer()
    .min(0)
    .required("Please enter the event start date/time"),
  [END_DATE_TIME]: yup
    .number()
    .integer()
    .min(
      yup.ref(START_DATE_TIME),
      "Event end date/time cannot be before start date/time",
    )
    .required("Please enter the event end date/time"),
  [DESCRIPTION]: yup.string().trim().notRequired(),
  [IMAGE]: yup.string().trim().notRequired(),
  [IS_SIGN_UP_ALLOWED]: yup.boolean().required(),
  [IS_SIGN_UP_APPROVAL_REQUIRED]: yup.boolean().required(),
  [IS_PUBLISHED]: yup.boolean().required(),
});

type Props = {
  onSubmit?: (data: EventFormProps) => Promise<unknown>;
  defaultValues?: EventFormProps;
  submitButtonProps: StrictButtonProps;
};

const defaultFormProps: EventFormProps = {
  [TITLE]: "",
  [ORGANIZED_BY]: "",
  [VENUE_NAME]: "",
  [CATEGORIES]: [],
  [CAPACITY]: "",
  [START_DATE_TIME]: 0,
  [END_DATE_TIME]: 0,
  [IMAGE]: "",
  [DESCRIPTION]: "",
  [IS_SIGN_UP_ALLOWED]: false,
  [IS_SIGN_UP_APPROVAL_REQUIRED]: false,
  [IS_PUBLISHED]: false,
};

function EventDetailsForm({
  onSubmit,
  defaultValues = {
    ...defaultFormProps,
    [START_DATE_TIME]: new Date().getTime(),
    [END_DATE_TIME]: new Date().getTime(),
  },
  submitButtonProps,
}: Props) {
  const methods = useForm<EventFormProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { handleSubmit, setValue } = methods;
  const {
    eventCategories: existingCategories,
    isLoading: isLoadingCategories,
    getEventCategories,
  } = useGetEventCategories();

  const isMounted = useRef(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const { isSignUpAllowed, onAllowSignUp } = useAllowSignUp(
    defaultValues.isSignUpAllowed,
    setValue,
  );

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    getEventCategories();
  }, [getEventCategories]);

  const _onSubmit = useCallback(
    async (formData: EventFormProps) => {
      setSubmitting(true);
      await onSubmit?.(deepTrim(formData));

      isMounted.current && setSubmitting(false);
    },
    [onSubmit],
  );

  return (
    <Segment className="event-details-form" raised>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(_onSubmit)}>
          <Grid columns="2" stackable stretched>
            <Grid.Column>
              <Form.Field className="flex-no-grow">
                <Header>Event Poster</Header>
              </Form.Field>
              <Controller
                name={IMAGE}
                defaultValue={defaultValues.image}
                render={({ onChange, value }) => (
                  <ImageUploadCropper
                    onChange={(value) => onChange(value ?? "")}
                    value={value}
                    fixedAspectRatio={1 / Math.sqrt(2)}
                    modal
                  />
                )}
              />
            </Grid.Column>
            <Grid.Column>
              <Header as={Form.Field}>
                Event Details
                <Header.Subheader>
                  Please fill in the details for the event.
                </Header.Subheader>
              </Header>

              <FormField required label="Event Title" inputName={TITLE} />

              <FormField
                required
                label="Organised By"
                inputName={ORGANIZED_BY}
              />

              <FormField
                label="Venue"
                placeholder="SRs, Dining Hall, Lounges, etc"
                inputName={VENUE_NAME}
              />

              <DropdownSelectorFormField
                inputName={CATEGORIES}
                label="Categories"
                placeholder="Insert/add any relevant categories for this event"
                search
                allowAdditions
                defaultOptions={existingCategories}
                multiple
                clearable
                isLoadingOptions={isLoadingCategories}
              />

              <FormField
                label="Estimated Capacity"
                inputName={CAPACITY}
                type="number"
              />

              <DateTimeFormField
                required
                label="Start Date and Time"
                inputName={START_DATE_TIME}
              />

              <DateTimeFormField
                required
                label="End Date and Time"
                inputName={END_DATE_TIME}
              />

              <TextAreaFormField label="Description" inputName={DESCRIPTION} />

              <Form.Group widths="equal">
                <RadioFormField
                  label="Allow Sign-up"
                  inputName={IS_SIGN_UP_ALLOWED}
                  type="toggle"
                  onChangeEffect={onAllowSignUp}
                />
                <RadioFormField
                  label="Sign-up Require Approval"
                  inputName={IS_SIGN_UP_APPROVAL_REQUIRED}
                  type="toggle"
                  disabled={!isSignUpAllowed}
                />
              </Form.Group>

              <Form.Group widths="equal">
                <RadioFormField
                  label="Publish"
                  inputName={IS_PUBLISHED}
                  type="toggle"
                />
                <Form.Button
                  {...submitButtonProps}
                  type="submit"
                  loading={isSubmitting}
                />
              </Form.Group>
            </Grid.Column>
          </Grid>
        </Form>
      </FormProvider>
    </Segment>
  );
}

export default EventDetailsForm;
