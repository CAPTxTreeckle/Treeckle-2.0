import React, { useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import {
  Divider,
  Form,
  Header,
  Segment,
  StrictButtonProps,
} from "semantic-ui-react";
import { FormProvider, useForm } from "react-hook-form";
import {
  CATEGORY,
  FIELD_LABEL,
  FIELD_TYPE,
  PHONE_NUM_REGEX,
  PLACEHOLDER_TEXT,
  POSITIVE_NUM_REGEX,
  RECOMMENDED_CAPACITY,
  REQUIRED_FIELD,
  VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION,
  VENUE_IC_CONTACT_NUMBER,
  VENUE_IC_EMAIL,
  VENUE_IC_NAME,
  VENUE_NAME,
} from "../../constants";
import FormField from "../form-field";
import VenueDetailsCustomFormFieldsSection from "../venue-details-custom-form-fields-section";
import { FieldType, VenueFormProps } from "../../types/venues";
import { useGetVenueCategories } from "../../custom-hooks/api";
import DropdownSelectorFormField from "../dropdown-selector-form-field";
import "./venue-details-form.scss";

const schema = yup.object().shape({
  [VENUE_NAME]: yup.string().trim().required("Please enter a venue name"),
  [CATEGORY]: yup
    .string()
    .trim()
    .required("Please select an existing category or add a new one"),
  [RECOMMENDED_CAPACITY]: yup
    .string()
    .trim()
    .matches(POSITIVE_NUM_REGEX, "Capacity must be a positive integer")
    .notRequired(),
  [VENUE_IC_NAME]: yup.string().trim().notRequired(),
  [VENUE_IC_EMAIL]: yup
    .string()
    .trim()
    .email("Input must be a valid email")
    .notRequired(),
  [VENUE_IC_CONTACT_NUMBER]: yup
    .string()
    .trim()
    .matches(PHONE_NUM_REGEX, "Input must be a valid phone number")
    .notRequired(),
  [VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION]: yup
    .array(
      yup
        .object()
        .shape({
          [FIELD_TYPE]: yup
            .mixed<FieldType>()
            .oneOf(Object.values(FieldType))
            .required("Please choose a field type"),
          [FIELD_LABEL]: yup
            .string()
            .trim()
            .required("Please enter a field label"),
          [PLACEHOLDER_TEXT]: yup.string().trim().notRequired(),
          [REQUIRED_FIELD]: yup.boolean().notRequired(),
        })
        .required(),
    )
    .notRequired(),
});

type Props = {
  onSubmit?: (data: VenueFormProps) => void;
  defaultValues?: VenueFormProps;
  submitButtonProps: StrictButtonProps;
};

const defaultFormProps: VenueFormProps = {
  [VENUE_NAME]: "",
  [CATEGORY]: "",
};

function VenueDetailsForm({
  defaultValues = defaultFormProps,
  onSubmit,
  submitButtonProps,
}: Props) {
  const methods = useForm<VenueFormProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { handleSubmit, getValues } = methods;
  const {
    venueCategories: existingCategories,
    isLoading: isLoadingCategories,
    getVenueCategories,
  } = useGetVenueCategories();

  const [isSubmitting, setSubmitting] = useState(false);

  useEffect(() => {
    getVenueCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onSubmit = useCallback(async () => {
    setSubmitting(true);
    if (!(await onSubmit?.(getValues()))) {
      setSubmitting(false);
    }
  }, [onSubmit, getValues]);

  return (
    <Segment id="venue-details-form" raised>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(_onSubmit)}>
          <Form.Field>
            <Header className="header">Venue Details</Header>
            <p>Please fill in the details for the venue.</p>
          </Form.Field>

          <Form.Group widths="equal">
            <FormField required label="Venue Name" inputName={VENUE_NAME} />

            <DropdownSelectorFormField
              inputName={CATEGORY}
              label="Category"
              placeholder="Select/add a new category"
              required
              search
              allowAdditions
              defaultOptions={existingCategories}
              isLoadingOptions={isLoadingCategories}
            />

            <FormField
              label="Recommended Capacity"
              inputName={RECOMMENDED_CAPACITY}
              type="number"
            />
          </Form.Group>

          <Form.Group widths="equal">
            <FormField label="Venue IC Name" inputName={VENUE_IC_NAME} />

            <FormField
              label="Venue IC Email"
              inputName={VENUE_IC_EMAIL}
              type="email"
            />

            <FormField
              label="Venue IC Contact Number"
              inputName={VENUE_IC_CONTACT_NUMBER}
              type="tel"
            />
          </Form.Group>

          <Divider />

          <Form.Field>
            <Header className="form-header">Custom Booking Form Fields</Header>
            <p>Please set up the fields for the booking form.</p>
          </Form.Field>

          <VenueDetailsCustomFormFieldsSection />

          <Divider />

          <div className="action-button-container justify-end">
            <Form.Button
              {...submitButtonProps}
              type="submit"
              loading={isSubmitting}
            />
          </div>
        </Form>
      </FormProvider>
    </Segment>
  );
}

export default VenueDetailsForm;
