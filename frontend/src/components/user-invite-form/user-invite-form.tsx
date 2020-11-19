import React, { useCallback, useState } from "react";
import { Icon, Input, Label, Message } from "semantic-ui-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import UserInviteUpload from "../user-invite-form-upload";
import "./user-invite-form.scss";

const emailValidation = yup.string().email();

function useUserInviteForm() {
  const [emails, setEmails] = useState<string[]>([]);
  const [errors, setErrors] = useState<boolean>(false);
  const { register, getValues, setValue } = useForm({});

  const resetEmails = useCallback(() => {
    setEmails([]);
  }, [setEmails]);

  const resetErrors = useCallback(() => {
    setErrors(false);
  }, [setErrors]);

  function handleAdd(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      const values = getValues("emails").trim();
      if (values !== "") {
        const splitValues = values.split(/\s+/);
        setEmails((state) => [...state, ...splitValues]);
        setValue("emails", "");
      }
    }
  }

  function handleDelete(email: string) {
    setEmails((state) => {
      return Object.assign(
        [],
        state.filter((e) => e !== email),
      );
    });
    resetErrors();
  }

  const addEmails = React.useCallback(
    (newEmails: string[]) => setEmails([...emails, ...newEmails]),
    [setEmails, emails],
  );

  function UserInviteForm() {
    return (
      <>
        {errors ? (
          <Message
            error
            content="One or more of the emails you have provided is invalid."
          />
        ) : (
          <Message info>
            Type or paste in the emails of the people you wish to invite,
            separated using spaces, and enter them in. Alternatively, upload a
            CSV file with the emails.
            <br />
            <br />
            <strong>Note</strong>: Please use the students' NUSNET emails and
            not their friendly emails. Thank you!
          </Message>
        )}

        <form>
          <Input
            fluid
            iconPosition="left"
            placeholder="Enter the emails of the people you wish to invite!"
          >
            <Icon name="users" />
            <input
              name="emails"
              className="user-invite-input"
              ref={register}
              onKeyPress={handleAdd}
            />
            <UserInviteUpload addEmails={addEmails} />
          </Input>
        </form>
        <Label.Group size="large">
          {emails.map((email) => {
            const isValid = emailValidation.isValidSync(email);
            if (!isValid && !errors) {
              setErrors(true);
            }
            return (
              <Label
                key={email}
                basic={isValid}
                color={!isValid ? "red" : "blue"}
                className="email-tags"
              >
                <Icon name="mail" />
                {email}
                <Icon name="delete" onClick={() => handleDelete(email)} />
              </Label>
            );
          })}
        </Label.Group>
      </>
    );
  }

  return { emails, resetEmails, resetErrors, errors, UserInviteForm };
}

export default useUserInviteForm;
