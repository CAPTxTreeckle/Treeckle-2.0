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
}: Props) {
  const { errors, register } = useFormContext();
  const error = get(errors, inputName);

  return (
    <Form.Field className={className} required={required} error={!!error}>
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
