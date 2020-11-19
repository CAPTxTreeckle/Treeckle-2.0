import React, { useCallback, useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import dayjs from "dayjs";
import {
  Form,
  Grid,
  Header,
  Segment,
  StrictButtonProps,
} from "semantic-ui-react";
import {
  ALLOW_SIGN_UP,
  CATEGORIES,
  DESCRIPTION,
  END_DATE_TIME,
  EVENT_TITLE,
  IMAGE,
  ORGANISED_BY,
  POSITIVE_NUM_REGEX,
  PUBLISH,
  ESTIMATED_CAPACITY,
  SIGN_UP_REQUIRE_APPROVAL,
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
import "./event-details-form.scss";
import DateTimeFormField from "../date-time-form-field";

const schema = yup.object().shape({
  [EVENT_TITLE]: yup.string().trim().required("Please enter an event title"),
  [ORGANISED_BY]: yup.string().trim().required("Please enter an organiser"),
  [VENUE_NAME]: yup.string().trim().notRequired(),
  [CATEGORIES]: yup.array(yup.string().trim().required()).notRequired(),
  [ESTIMATED_CAPACITY]: yup
    .string()
    .trim()
    .matches(POSITIVE_NUM_REGEX, "Capacity must be a positive integer")
    .notRequired(),
  [START_DATE_TIME]: yup
    .date()
    .required("Please enter the event start date and time")
    .typeError("Please enter the event start date and time"),
  [END_DATE_TIME]: yup
    .date()
    .when(
      START_DATE_TIME,
      (startDateTime: Date, schema: yup.DateSchema<Date, unknown>) =>
        dayjs(startDateTime).isValid()
          ? schema.min(
              startDateTime,
              "Event end datetime cannot be before start date and time",
            )
          : schema,
    )
    .required("Please enter the event end datetime")
    .typeError("Please enter the event end datetime"),
  [DESCRIPTION]: yup.string().trim().notRequired(),
  [IMAGE]: yup.string().trim().notRequired(),
  [ALLOW_SIGN_UP]: yup.boolean().required(),
  [SIGN_UP_REQUIRE_APPROVAL]: yup.boolean().required(),
  [PUBLISH]: yup.boolean().required(),
});

type Props = {
  onSubmit?: (data: EventFormProps) => void;
  defaultValues?: EventFormProps;
  submitButtonProps: { content: string; color: StrictButtonProps["color"] };
};

const defaultFormProps: EventFormProps = {
  [EVENT_TITLE]: "",
  [ORGANISED_BY]: "",
  [CATEGORIES]: [],
  [START_DATE_TIME]: new Date(0),
  [END_DATE_TIME]: new Date(0),
  [IMAGE]: "",
  [ALLOW_SIGN_UP]: false,
  [SIGN_UP_REQUIRE_APPROVAL]: false,
  [PUBLISH]: false,
};

function EventDetailsForm({
  onSubmit,
  defaultValues = {
    ...defaultFormProps,
    [START_DATE_TIME]: new Date(),
    [END_DATE_TIME]: new Date(),
  },
  submitButtonProps,
}: Props) {
  const methods = useForm<EventFormProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { handleSubmit, getValues, setValue } = methods;
  const {
    eventCategories: existingCategories,
    isLoading: isLoadingCategories,
    getEventCategories,
  } = useGetEventCategories();
  const [isSubmitting, setSubmitting] = useState(false);
  const { allowSignUp, onAllowSignUp } = useAllowSignUp(
    defaultValues.allowSignUp,
    setValue,
  );

  useEffect(() => {
    getEventCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onSubmit = useCallback(async () => {
    setSubmitting(true);
    if (!(await onSubmit?.(getValues()))) {
      setSubmitting(false);
    }
  }, [onSubmit, getValues]);

  return (
    <Segment id="event-details-form" raised>
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
                    onChange={onChange}
                    value={value}
                    fixedAspectRatio={1 / Math.sqrt(2)}
                  />
                )}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Field>
                <Header className="header">Event Details</Header>
                <p>Please fill in the details for the event.</p>
              </Form.Field>

              <FormField required label="Event Title" inputName={EVENT_TITLE} />

              <FormField
                required
                label="Organised By"
                inputName={ORGANISED_BY}
              />

              <FormField label="Venue" inputName={VENUE_NAME} />

              <DropdownSelectorFormField
                inputName={CATEGORIES}
                label="Categories"
                placeholder="Insert any relevant categories for this event"
                search
                allowAdditions
                defaultOptions={existingCategories}
                multiple
                clearable
                isLoadingOptions={isLoadingCategories}
              />

              <FormField
                label="Estimated Capacity"
                inputName={ESTIMATED_CAPACITY}
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
                  inputName={ALLOW_SIGN_UP}
                  type="toggle"
                  onChangeEffect={onAllowSignUp}
                />
                <RadioFormField
                  label="Sign-up Require Approval"
                  inputName={SIGN_UP_REQUIRE_APPROVAL}
                  type="toggle"
                  disabled={!allowSignUp}
                />
              </Form.Group>

              <Form.Group widths="equal">
                <RadioFormField
                  label="Publish"
                  inputName={PUBLISH}
                  type="toggle"
                />
                <Form.Button
                  type="submit"
                  loading={isSubmitting}
                  {...submitButtonProps}
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
