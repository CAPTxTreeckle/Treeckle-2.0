import React from "react";
import get from "lodash.get";
import { useFormContext } from "react-hook-form";
import { Form, Label } from "semantic-ui-react";

type Props = {
  className?: string;
  required?: boolean;
  label?: string;
  inputName: string;
  errorMsg?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  rows?: number;
  hidden?: boolean;
};

function TextAreaFormField({
  className,
  required = false,
  label,
  inputName,
  errorMsg,
  placeholder,
  defaultValue,
  readOnly = false,
  rows,
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
      <textarea
        placeholder={placeholder}
        name={inputName}
        ref={register({ required })}
        defaultValue={defaultValue}
        readOnly={readOnly}
        rows={rows}
      />
    </Form.Field>
  );
}

export default TextAreaFormField;
