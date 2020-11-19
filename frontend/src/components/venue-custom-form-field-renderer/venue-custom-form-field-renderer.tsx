import React from "react";
import { FieldType, VenueCustomFormFieldProps } from "../../types/venues";
import FormField from "../form-field";
import RadioFormFieldManualRegister from "../radio-form-field-manual-register";
import TextAreaFormField from "../text-area-form-field";

type Props = VenueCustomFormFieldProps & {
  inputName: string;
  readOnly?: boolean;
  defaultValues?: Record<string, string | number>;
};

function VenueCustomFormFieldRenderer({
  inputName,
  fieldLabel,
  fieldType,
  placeholderText = "",
  requiredField = false,
  readOnly = false,
  defaultValues,
}: Props) {
  const renderVenueCustomFormField = () => {
    switch (fieldType) {
      case FieldType.TEXT:
        return (
          <FormField
            label={fieldLabel}
            inputName={inputName}
            placeholder={placeholderText}
            required={requiredField}
            readOnly={readOnly}
            defaultValue={defaultValues && (defaultValues[inputName] as string)}
          />
        );
      case FieldType.TEXT_AREA:
        return (
          <TextAreaFormField
            label={fieldLabel}
            inputName={inputName}
            placeholder={placeholderText}
            required={requiredField}
            readOnly={readOnly}
            rows={8}
            defaultValue={defaultValues && (defaultValues[inputName] as string)}
          />
        );
      case FieldType.NUMBER:
        return (
          <FormField
            label={fieldLabel}
            inputName={inputName}
            placeholder={placeholderText}
            required={requiredField}
            readOnly={readOnly}
            type="number"
            defaultValue={defaultValues && (defaultValues[inputName] as string)}
          />
        );
      case FieldType.BOOLEAN:
        return (
          <RadioFormFieldManualRegister
            label={fieldLabel}
            inputName={inputName}
            type="checkbox"
            readOnly={readOnly}
          />
        );
    }
  };

  return renderVenueCustomFormField();
}

export default VenueCustomFormFieldRenderer;
