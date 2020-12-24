import { Controller, useFormContext } from "react-hook-form";
import { DateTimeInput } from "semantic-ui-calendar-react";
import get from "lodash.get";
import { displayDateTime, parseDateTime } from "../../utils/parser-utils";

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
          value={displayDateTime(value)}
          onChange={(event, { value }) => onChange(parseDateTime(value))}
          onBlur={onBlur}
          hideMobileKeyboard
          popupPosition="bottom left"
          dateTimeFormat="DD/MM/YYYY h.mm A"
          preserveViewMode={false}
          closable
        />
      )}
    />
  );
}

export default DateTimeFormField;
