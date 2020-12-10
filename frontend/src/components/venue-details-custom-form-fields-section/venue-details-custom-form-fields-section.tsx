import React from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useFieldArray } from "react-hook-form";
import { Button, Form, Popup } from "semantic-ui-react";
import { VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION } from "../../constants";
import { FieldType, VenueCustomFormFieldProps } from "../../types/venues";
import VenueDetailsCustomFormField from "../venue-details-custom-form-field";

function VenueDetailsCustomFormFieldsSection() {
  const {
    fields,
    append,
    remove,
    move,
  } = useFieldArray<VenueCustomFormFieldProps>({
    name: VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION,
  });

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }

    const { index: destinationIndex } = destination;
    const { index: sourceIndex } = source;

    if (destinationIndex === sourceIndex) {
      return;
    }

    move(sourceIndex, destinationIndex);
  };

  return (
    <>
      <Form.Field>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION}>
            {({ innerRef, droppableProps, placeholder }) => (
              <div ref={innerRef} {...droppableProps}>
                {fields.map((field, index) => {
                  const {
                    id,
                    fieldLabel = "",
                    placeholderText = "",
                    fieldType = FieldType.TEXT,
                    requiredField = false,
                  } = field;
                  return (
                    <Draggable
                      key={id}
                      index={index}
                      draggableId={id ?? `${index}`}
                    >
                      {({ innerRef, draggableProps, dragHandleProps }) => (
                        <div ref={innerRef} {...draggableProps}>
                          <VenueDetailsCustomFormField
                            index={index}
                            onDeleteField={() => remove(index)}
                            defaultValues={{
                              fieldLabel,
                              placeholderText,
                              fieldType,
                              requiredField,
                            }}
                            dragHandleProps={dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Form.Field>

      <Popup
        content="Add a new field"
        trigger={
          <Button
            type="button"
            color="green"
            icon="plus"
            onClick={() => append({})}
          />
        }
        position="right center"
        on="hover"
      />
    </>
  );
}

export default VenueDetailsCustomFormFieldsSection;
