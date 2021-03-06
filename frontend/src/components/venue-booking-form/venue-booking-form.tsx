import React from "react";
import { Card, Form, Header } from "semantic-ui-react";
import { useForm, FormProvider } from "react-hook-form";
import {
  CustomVenueBookingFormFieldProps,
  VenueFormProps,
} from "../../types/venues";
import PlaceholderWrapper from "../placeholder-wrapper";
import { CUSTOM_VENUE_BOOKING_FORM_FIELDS } from "../../constants";
import CustomFormFieldRenderer from "../custom-form-field-renderer";
import "./venue-booking-form.scss";

type Props = {
  venueFormProps: VenueFormProps;
  readOnly?: boolean;
};

function VenueBookingForm({ venueFormProps, readOnly = false }: Props) {
  const {
    name,
    category,
    [CUSTOM_VENUE_BOOKING_FORM_FIELDS]: fields = [],
  } = venueFormProps;
  const methods = useForm<CustomVenueBookingFormFieldProps[]>();

  return (
    <FormProvider {...methods}>
      <Form className="venue-booking-form">
        <Card raised>
          <Card.Content className="flex-no-grow">
            <Header textAlign="center">
              {name}
              <Header.Subheader>{category}</Header.Subheader>
            </Header>
          </Card.Content>
          <Card.Content>
            <PlaceholderWrapper
              defaultMessage="No custom booking fields"
              showDefaultMessage={fields.length === 0}
              placeholder
            >
              {fields.map((field, index) => (
                <CustomFormFieldRenderer
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
