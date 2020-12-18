import React from "react";
import { Form, Label } from "semantic-ui-react";
import get from "lodash.get";
import { useFormContext } from "react-hook-form";

type Props = {
  className?: string;
  required?: boolean;
  label?: string;
  inputName: string;
  type?: string;
  errorMsg?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  hidden?: boolean;
};

function FormField({
  className,
  required = false,
  label,
  errorMsg,
  inputName,
  type = "TEXT",
  placeholder,
  defaultValue,
  readOnly = false,
  hidden = false,
}: Props) {
  const { errors, register } = useFormContext();
  const error = get(errors, inputName);

  return (
    <Form.Field
      className={className}
      required={required}
      error={!!error}
      style={hidden ? { display: "none" } : undefined}
    >
      {label && <label>{label}</label>}
      {error && (
        <Label
          basic
          color="red"
          content={errorMsg ?? error?.message}
          pointing="below"
        />
      )}
      <input
        placeholder={placeholder}
        type={type}
        name={inputName}
        ref={register({ required })}
        defaultValue={defaultValue}
        readOnly={readOnly}
      />
    </Form.Field>
  );
}

export default FormField;
