import React, { useState } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { Controller, useFormContext } from "react-hook-form";
import { Card, Form, Icon, Popup, Select } from "semantic-ui-react";
import {
  FIELD_LABEL,
  FIELD_TYPE,
  PLACEHOLDER_TEXT,
  REQUIRED_FIELD,
  VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION,
} from "../../constants";
import {
  FieldType,
  VenueCustomFormFieldProps,
  VenueFormProps,
} from "../../types/venues";
import FormField from "../form-field";
import RadioFormField from "../radio-form-field";
import "./venue-details-custom-form-field.scss";

const typeOptions = [
  {
    value: FieldType.TEXT,
    text: "Single-line Input",
    icon: "minus",
  },
  {
    value: FieldType.TEXT_AREA,
    text: "Multi-line Input",
    icon: "bars",
  },
  {
    value: FieldType.NUMBER,
    text: "Number",
    icon: "sort numeric down",
  },
  {
    value: FieldType.BOOLEAN,
    text: "Yes / No",
    icon: "radio",
  },
];

type Props = {
  index: number;
  onDeleteField: () => void;
  defaultValues?: VenueCustomFormFieldProps;
  dragHandleProps?: DraggableProvidedDragHandleProps;
};

const defaultFormProps: VenueCustomFormFieldProps = {
  [FIELD_TYPE]: FieldType.TEXT,
  [FIELD_LABEL]: "",
  [REQUIRED_FIELD]: false,
  [PLACEHOLDER_TEXT]: "",
};

function VenueDetailsCustomFormField({
  index,
  onDeleteField,
  defaultValues = defaultFormProps,
  dragHandleProps,
}: Props) {
  const { setValue } = useFormContext<VenueFormProps>();
  const [isBooleanField, setBooleanField] = useState(
    defaultValues[FIELD_TYPE] === FieldType.BOOLEAN,
  );
  const fieldType = `${VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION}[${index}].${FIELD_TYPE}`;
  const fieldLabel = `${VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION}[${index}].${FIELD_LABEL}`;
  const placeholderText = `${VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION}[${index}].${PLACEHOLDER_TEXT}`;
  const requiredField = `${VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION}[${index}].${REQUIRED_FIELD}`;

  return (
    <div id="venue-details-custom-form-field">
      <Card raised fluid>
        <Card.Content className="top-bar">
          <div className="section left">
            <div className="field-number">{index + 1}</div>

            <Controller
              name={fieldType}
              defaultValue={defaultValues[FIELD_TYPE]}
              rules={{ required: true }}
              render={({ onChange, onBlur, value }) => (
                <Select
                  value={value}
                  onBlur={onBlur}
                  onChange={(event, { value }) => {
                    onChange(value);

                    if (value === FieldType.BOOLEAN) {
                      setBooleanField(true);
                      setValue(requiredField, false);
                      setValue(placeholderText, "");
                    } else {
                      setBooleanField(false);
                    }
                  }}
                  className="type-selector"
                  options={typeOptions}
                />
              )}
            />
          </div>

          <div className="section right">
            <div {...dragHandleProps} className="drag-zone">
              <Icon name="braille" fitted />
            </div>
          </div>
        </Card.Content>

        <Card.Content>
          <Form.Group widths="equal">
            <FormField
              required
              label="Field Label"
              inputName={fieldLabel}
              defaultValue={defaultValues.fieldLabel}
            />
            <FormField
              label="Placeholder Text"
              inputName={placeholderText}
              defaultValue={defaultValues.placeholderText}
              hidden={isBooleanField}
            />
          </Form.Group>
        </Card.Content>

        <Card.Content className="bottom-bar">
          <div
            className="section left"
            style={isBooleanField ? { display: "none" } : undefined}
          >
            <RadioFormField
              label="Required Field"
              inputName={requiredField}
              defaultValue={defaultValues.requiredField}
              className="required-field-toggler"
              type="toggle"
            />
          </div>

          <div className="section right">
            <div className="delete-button">
              <Popup
                content="Delete field"
                trigger={
                  <Icon
                    color="red"
                    fitted
                    name="trash alternate outline"
                    link
                    onClick={onDeleteField}
                  />
                }
                position="left center"
              />
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

export default VenueDetailsCustomFormField;
