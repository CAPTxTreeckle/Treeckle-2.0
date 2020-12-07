import React, { useCallback, useContext } from "react";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "semantic-ui-react";
import { UserCreationSectionContext } from "../user-creation-section";
import {
  PendingCreationUser,
  Role,
  roles,
  UserCreationStatus,
} from "../../types/users";
import {
  EMAILS,
  ROLE,
  EMAIL_REGEX,
  COMMA_NEWLINE_REGEX,
} from "../../constants";
import TextAreaFormField from "../text-area-form-field";
import DropdownSelectorFormField from "../dropdown-selector-form-field";
import { sanitizeArray } from "../../utils/parsers";

type UserCreationFormProps = {
  [ROLE]: Role.Resident;
  [EMAILS]: string;
};

const schema = yup.object().shape({
  [ROLE]: yup.mixed<Role>().oneOf(roles).required("Please choose a role"),
  [EMAILS]: yup.string().trim().required("Please enter email(s)"),
});

const defaultValues: UserCreationFormProps = {
  [ROLE]: Role.Resident,
  [EMAILS]: "",
};

function UserCreationForm() {
  const { setPendingCreationUsers, pendingCreationUsers } = useContext(
    UserCreationSectionContext,
  );
  const methods = useForm<UserCreationFormProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { handleSubmit, getValues, reset } = methods;

  const onSubmit = useCallback(() => {
    const { role, emails: inputString } = getValues();
    const parsedWords = inputString
      .trim()
      .replace(COMMA_NEWLINE_REGEX, " ")
      .toLowerCase()
      .split(" ");

    const sanitizedWords = sanitizeArray(parsedWords, false);
    const pendingCreationEmails = new Set(
      pendingCreationUsers.map(({ email }) => email),
    );

    const newPendingCreationUsers: PendingCreationUser[] = sanitizedWords.map(
      (email) => {
        if (!EMAIL_REGEX.test(email)) {
          return { email, role, status: UserCreationStatus.Invalid };
        }

        if (pendingCreationEmails.has(email)) {
          return { email, role, status: UserCreationStatus.Duplicated };
        }

        pendingCreationEmails.add(email);
        return { email, role, status: UserCreationStatus.New };
      },
    );

    const updatedPendingCreationUsers = newPendingCreationUsers.concat(
      pendingCreationUsers,
    );

    setPendingCreationUsers(updatedPendingCreationUsers);
    reset({ emails: "", role });
  }, [getValues, pendingCreationUsers, setPendingCreationUsers, reset]);

  return (
    <FormProvider {...methods}>
      <h2 className="black-text">Manual Input</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <DropdownSelectorFormField
          inputName={ROLE}
          label="Role"
          required
          defaultOptions={roles}
        />

        <TextAreaFormField inputName={EMAILS} label="Emails" required />

        <Form.Button
          fluid
          type="submit"
          icon="plus"
          content="Add"
          color="green"
        />
      </Form>
    </FormProvider>
  );
}

export default UserCreationForm;
