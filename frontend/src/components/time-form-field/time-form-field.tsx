import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TimeInput } from "semantic-ui-calendar-react";
import get from "lodash.get";
import { displayDatetime, parseDatetime } from "../../utils/parser";
import "./time-form-field.scss";
import { TIME_FORMAT } from "../../constants";

type Props = {
  className?: string;
  required?: boolean;
  label?: string;
  inputName: string;
  errorMsg?: string;
  defaultValue?: string;
  onClick?: () => void;
};

function TimeFormField({
  className,
  required = false,
  label,
  errorMsg,
  inputName,
  defaultValue,
  onClick,
}: Props) {
  const { errors, formState } = useFormContext();
  const { isDirty } = formState;
  const error = get(errors, inputName);

  const canShowErrorLabel = error && isDirty && (errorMsg || error?.message);

  return (
    <Controller
      name={inputName}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ value, onChange, onBlur }) => (
        <TimeInput
          className={
            className
              ? `time-form-field-input" ${className}`
              : "time-form-field-input"
          }
          label={label}
          required={required}
          error={
            canShowErrorLabel && {
              basic: true,
              color: "red",
              content: errorMsg ?? error?.message,
              pointing: "below",
            }
          }
          value={displayDatetime(value, TIME_FORMAT)}
          onChange={(_event, { value }) =>
            onChange(parseDatetime(value, TIME_FORMAT))
          }
          onBlur={onBlur}
          hideMobileKeyboard
          popupPosition="bottom left"
          preserveViewMode={false}
          closable
          onClick={onClick}
          timeFormat="ampm"
        />
      )}
    />
  );
}

export default TimeFormField;
