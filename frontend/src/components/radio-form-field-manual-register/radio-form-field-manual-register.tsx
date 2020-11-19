import React from "react";
import { useFormContext } from "react-hook-form";
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
    e: React.FormEvent<HTMLInputElement>,
    data: CheckboxProps,
  ) => void;
  hidden?: boolean;
};

function RadioFormFieldManualRegister({
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
  const { register, setValue, getValues } = useFormContext();

  React.useEffect(() => {
    register(inputName);
    setValue(inputName, getValues()[inputName] ?? defaultValue);
  }, [register, defaultValue, getValues, inputName, setValue]);

  const handleChange = (
    event: React.FormEvent<HTMLInputElement>,
    data: CheckboxProps,
  ) => {
    setValue(inputName, data.checked);
    onChangeEffect?.(event, data);
  };

  return (
    <Form.Checkbox
      name={inputName}
      className={className}
      label={label}
      onChange={handleChange}
      checked={getValues()[inputName]}
      slider={type === "slider"}
      toggle={type === "toggle"}
      readOnly={readOnly}
      disabled={disabled}
      style={hidden ? { display: "none" } : undefined}
      defaultChecked={defaultValue}
    />
  );
}

export default RadioFormFieldManualRegister;
