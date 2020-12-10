import React from "react";
import { Card, Form } from "semantic-ui-react";
import { useForm, FormProvider } from "react-hook-form";
import { VenueCustomFormFieldProps, VenueFormProps } from "../../types/venues";
import PlaceholderWrapper from "../placeholder-wrapper";
import { VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION } from "../../constants";
import VenueCustomFormFieldRenderer from "../venue-custom-form-field-renderer";
import "./venue-booking-form.scss";

type Props = {
  venueFormProps: VenueFormProps;
  readOnly?: boolean;
};

function VenueBookingForm({ venueFormProps, readOnly = false }: Props) {
  const {
    name,
    [VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION]: fields = [],
  } = venueFormProps;
  const methods = useForm<VenueCustomFormFieldProps[]>();

  return (
    <FormProvider {...methods}>
      <Form id="venue-booking-form">
        <Card raised>
          <Card.Content className="flex-no-grow">
            <Card.Header textAlign="center">{name}</Card.Header>
          </Card.Content>
          <Card.Content>
            <PlaceholderWrapper
              defaultMessage="No custom booking fields"
              showDefaultMessage={fields.length === 0}
              placeholder
            >
              {fields.map((field, index) => (
                <VenueCustomFormFieldRenderer
                  key={index}
                  inputName={`${index}`}
                  readOnly={readOnly}
                  {...field}
                />
              ))}
            </PlaceholderWrapper>
          </Card.Content>
        </Card>
      </Form>
    </FormProvider>
  );
}

export default VenueBookingForm;
