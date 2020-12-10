import React from "react";
import { FieldType, VenueCustomFormFieldProps } from "../../types/venues";
import FormField from "../form-field";
import RadioFormField from "../radio-form-field";
import TextAreaFormField from "../text-area-form-field";

type Props = VenueCustomFormFieldProps & {
  inputName: string;
  readOnly?: boolean;
};

function VenueCustomFormFieldRenderer({
  inputName,
  fieldLabel,
  fieldType,
  placeholderText,
  requiredField,
  readOnly = false,
}: Props) {
  return (() => {
    switch (fieldType) {
      case FieldType.TEXT:
        return (
          <FormField
            label={fieldLabel}
            inputName={inputName}
            placeholder={placeholderText}
            required={requiredField}
            readOnly={readOnly}
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
          />
        );
      case FieldType.BOOLEAN:
        return (
          <RadioFormField
            label={fieldLabel}
            inputName={inputName}
            type="checkbox"
            readOnly={readOnly}
          />
        );
      default:
        return null;
    }
  })();
}

export default VenueCustomFormFieldRenderer;
