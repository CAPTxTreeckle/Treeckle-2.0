import React from "react";
import { FieldType, CustomVenueFormFieldProps } from "../../types/venues";
import FormField from "../form-field";
import RadioFormField from "../radio-form-field";
import TextAreaFormField from "../text-area-form-field";

type Props = CustomVenueFormFieldProps & {
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
      case FieldType.Text:
        return (
          <FormField
            label={fieldLabel}
            inputName={inputName}
            placeholder={placeholderText}
            required={requiredField}
            readOnly={readOnly}
          />
        );
      case FieldType.TextArea:
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
      case FieldType.Number:
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
      case FieldType.Boolean:
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
