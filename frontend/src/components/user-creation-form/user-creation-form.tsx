import React, { useCallback, useContext } from "react";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "semantic-ui-react";
import { toast } from "react-toastify";
import { UserCreationSectionContext } from "../user-creation-section";
import { Role, roles } from "../../types/users";
import { EMAILS, ROLE } from "../../constants";
import TextAreaFormField from "../text-area-form-field";
import DropdownSelectorFormField from "../dropdown-selector-form-field";
import { parseInputDataToPendingCreationUsers } from "./helper";

type UserCreationFormProps = {
  [ROLE]: Role.Resident;
  [EMAILS]: string;
};

const schema = yup.object().shape({
  [ROLE]: yup.mixed<Role>().oneOf(roles).required("Please choose a role"),
  [EMAILS]: yup.string().trim().required("Please enter the email(s)"),
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
    const { role, emails: data } = getValues();

    const parsedPendingCreationUsers = parseInputDataToPendingCreationUsers(
      data,
      role,
      pendingCreationUsers,
    );

    const updatedPendingCreationUsers = parsedPendingCreationUsers.concat(
      pendingCreationUsers,
    );

    setPendingCreationUsers(updatedPendingCreationUsers);
    reset({ emails: "", role });
    toast.info("The input has been successfully parsed.");
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

        <Form.Button fluid type="submit" content="Parse Input" color="blue" />
      </Form>
    </FormProvider>
  );
}

export default UserCreationForm;
