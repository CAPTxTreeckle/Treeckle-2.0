import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DateTimeInput } from "semantic-ui-calendar-react";
import get from "lodash.get";
import { DATE_TIME_FORMAT } from "../../constants";
import { displayDatetime, parseDatetime } from "../../utils/parsers";

type Props = {
  className?: string;
  required?: boolean;
  label?: string;
  inputName: string;
  errorMsg?: string;
  defaultValue?: string;
};

function DateTimeFormField({
  className,
  required = false,
  label,
  errorMsg,
  inputName,
  defaultValue,
}: Props) {
  const { errors } = useFormContext();
  const error = get(errors, inputName);

  return (
    <Controller
      name={inputName}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ value, onChange, onBlur }) => (
        <DateTimeInput
          className={className}
          label={label}
          required={required}
          error={
            error && {
              basic: true,
              color: "red",
              content: errorMsg ?? error?.message,
              pointing: "below",
            }
          }
          value={displayDatetime(value)}
          onChange={(event, { value }) => onChange(parseDatetime(value))}
          onBlur={onBlur}
          hideMobileKeyboard
          popupPosition="bottom left"
          dateTimeFormat={DATE_TIME_FORMAT}
          preserveViewMode={false}
          closable
        />
      )}
    />
  );
}

export default DateTimeFormField;
