import React from "react";
import { Card, Form } from "semantic-ui-react";
import { useForm, FormProvider } from "react-hook-form";
import { VenueFormProps } from "../../types/venues";
import PlaceholderWrapper from "../placeholder-wrapper";
import { VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION } from "../../constants";
import VenueCustomFormFieldRenderer from "../venue-custom-form-field-renderer";
import "./venue-booking-form.scss";

export interface VenueBookingFormWrapperProps {
  children: React.ReactNode;
  onSubmit: () => unknown;
}

type Props = {
  className?: string;
  venueFormProps: VenueFormProps;
  readOnly?: boolean;
  withCard?: boolean;
  customFormWrapper?: (props: VenueBookingFormWrapperProps) => JSX.Element;
  onSubmit?: (values?: Record<string, string | number>) => void;
  defaultValues?: Record<string, string | number>;
};

function VenueBookingForm({
  className,
  venueFormProps,
  readOnly = false,
  withCard = true,
  customFormWrapper,
  onSubmit,
  defaultValues,
}: Props) {
  const methods = useForm<Record<string, string | number>>();
  const { handleSubmit } = methods;

  function VenueCustomFormFields() {
    if (!venueFormProps) {
      return null;
    }

    const {
      [VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION]: fields = [],
    } = venueFormProps;

    return (
      <PlaceholderWrapper
        defaultMessage="No custom booking fields"
        showDefaultMessage={fields.length === 0}
        placeholder
      >
        {fields.map((field, index) => (
          <VenueCustomFormFieldRenderer
            key={index}
            inputName={field.fieldLabel}
            readOnly={readOnly}
            defaultValues={defaultValues}
            {...field}
          />
        ))}
      </PlaceholderWrapper>
    );
  }

  async function submit() {
    let isSubmitted = true;
    await handleSubmit(
      (data) => {
        onSubmit && onSubmit(data);
      },
      () => {
        isSubmitted = false;
      },
    )();
    return isSubmitted;
  }

  const Wrapper = customFormWrapper as (
    props: VenueBookingFormWrapperProps,
  ) => JSX.Element;

  function WrappedForm() {
    if (!venueFormProps) {
      return null;
    }

    return (
      <FormProvider {...methods}>
        <Form id="venue-booking-form" className={className ?? ""}>
          {withCard ? (
            <Card raised>
              <Card.Content className="flex-no-grow">
                <Card.Header textAlign="center">
                  {venueFormProps.venueName}
                </Card.Header>
              </Card.Content>
              <Card.Content>
                <VenueCustomFormFields />
              </Card.Content>
            </Card>
          ) : (
            <div className="venue-booking-form-fields-container">
              <VenueCustomFormFields />
            </div>
          )}
        </Form>
      </FormProvider>
    );
  }

  return customFormWrapper ? (
    <Wrapper onSubmit={submit}>
      <WrappedForm />
    </Wrapper>
  ) : (
    <WrappedForm />
  );
}

export default VenueBookingForm;
