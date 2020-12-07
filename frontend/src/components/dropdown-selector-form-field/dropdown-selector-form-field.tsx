import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DropdownProps, Form } from "semantic-ui-react";
import get from "lodash.get";
import { useOptionsState } from "../../custom-hooks";
import { sanitizeArray } from "../../utils/parsers";

type Props = {
  className?: string;
  required?: boolean;
  label?: string;
  inputName: string;
  errorMsg?: string;
  placeholder?: string;
  defaultValue?: string | string[];
  defaultOptions?: string[];
  isLoadingOptions?: boolean;
  multiple?: boolean;
  allowAdditions?: boolean;
  search?: boolean;
  clearable?: boolean;
  onChangeEffect?: (
    e: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => void;
};

function DropdownSelectorFormField({
  className,
  required = false,
  label,
  inputName,
  errorMsg,
  placeholder,
  defaultValue,
  defaultOptions = [],
  isLoadingOptions = false,
  multiple = false,
  allowAdditions = false,
  search = false,
  clearable = false,
  onChangeEffect,
}: Props) {
  const { options, onSelect } = useOptionsState(defaultOptions);
  const { errors, getValues } = useFormContext();
  const error = get(errors, inputName);

  return (
    <Controller
      name={inputName}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ onChange, onBlur, value }) => (
        <Form.Select
          className={className}
          loading={isLoadingOptions}
          placeholder={placeholder}
          label={label}
          required={required}
          options={options}
          search={search}
          allowAdditions={allowAdditions}
          onBlur={onBlur}
          multiple={multiple}
          clearable={clearable}
          onChange={(event, data) => {
            const { value } = data;
            const trimmedValue = sanitizeArray(
              Array.isArray(value) ? (value as string[]) : [value as string],
            );

            if (multiple) {
              if (
                JSON.stringify(trimmedValue) ===
                JSON.stringify(getValues(inputName))
              ) {
                return;
              }
              onChange(trimmedValue);
            } else {
              if (
                (!clearable && trimmedValue.length === 0) ||
                trimmedValue?.[0] === getValues(inputName)
              ) {
                return;
              }
              onChange(trimmedValue?.[0] ?? "");
            }

            onSelect(trimmedValue);
            onChangeEffect?.(event, data);
          }}
          value={value}
          error={
            error && {
              basic: true,
              color: "red",
              content: errorMsg ?? error?.message,
              pointing: "below",
            }
          }
        />
      )}
    />
  );
}

export default DropdownSelectorFormField;
