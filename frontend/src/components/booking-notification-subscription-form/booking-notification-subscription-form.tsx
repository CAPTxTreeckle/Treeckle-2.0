import React, { useCallback, useContext, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Header } from "semantic-ui-react";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { EMAIL, NAME } from "../../constants";
import { BookingNotificationSubscriptionContext } from "../../context-providers";
import { OrganizationListenerPostData } from "../../types/organizations";
import { deepTrim } from "../../utils/parser-utils";
import FormField from "../form-field";
import "./booking-notification-subscription-form.scss";

const schema = yup.object().shape({
  [NAME]: yup.string().trim().required("Please enter a name"),
  [EMAIL]: yup
    .string()
    .trim()
    .email("Input must be a valid email")
    .required("Please enter an email"),
});

const defaultValues = {
  [NAME]: "",
  [EMAIL]: "",
};

function BookingNotificationSubscriptionForm() {
  const methods = useForm<OrganizationListenerPostData>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { createBookingNotificationSubscribers } = useContext(
    BookingNotificationSubscriptionContext,
  );
  const [isSubmitting, setSubmitting] = useState(false);

  const { handleSubmit, reset } = methods;

  const onSubmit = useCallback(
    async (formData: OrganizationListenerPostData) => {
      setSubmitting(true);
      if (await createBookingNotificationSubscribers([deepTrim(formData)])) {
        reset();
      }
      setSubmitting(false);
    },
    [createBookingNotificationSubscribers, reset],
  );

  return (
    <FormProvider {...methods}>
      <Form
        className="booking-notification-subscription-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Header as={Form.Field}>Add Subscribers</Header>
        <Form.Group widths="equal" className="fields-container">
          <FormField width="7" required label="Name" inputName={NAME} />
          <FormField
            width="7"
            required
            label="Email"
            inputName={EMAIL}
            type="email"
          />
          <Form.Button
            width="2"
            type="submit"
            color="blue"
            content="Add"
            loading={isSubmitting}
            fluid
          />
        </Form.Group>
      </Form>
    </FormProvider>
  );
}

export default BookingNotificationSubscriptionForm;
