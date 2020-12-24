import { FormEvent } from "react";
import { Controller } from "react-hook-form";
import { CheckboxProps, Form } from "semantic-ui-react";

type Props = {
  className?: string;
  label?: string;
  inputName: string;
  type: "slider" | "toggle" | "checkbox";
  defaultValue?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChangeEffect?: (
    e: FormEvent<HTMLInputElement>,
    data: CheckboxProps,
  ) => void;
  hidden?: boolean;
};

function RadioFormField({
  className,
  label,
  inputName,
  type,
  defaultValue,
  readOnly = false,
  disabled = false,
  onChangeEffect,
  hidden = false,
}: Props) {
  return (
    <Controller
      name={inputName}
      defaultValue={defaultValue}
      render={({ onChange, onBlur, value }) => (
        <Form.Checkbox
          className={className}
          onBlur={onBlur}
          label={label}
          onChange={(event, data) => {
            onChange(data.checked);
            onChangeEffect?.(event, data);
          }}
          checked={value}
          slider={type === "slider"}
          toggle={type === "toggle"}
          readOnly={readOnly}
          disabled={disabled}
          style={hidden ? { display: "none" } : undefined}
        />
      )}
    />
  );
}

export default RadioFormField;
