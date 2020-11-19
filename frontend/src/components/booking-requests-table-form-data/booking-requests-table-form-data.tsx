import React from "react";
import { Grid } from "semantic-ui-react";
import { SemanticWIDTHS } from "semantic-ui-react/dist/commonjs/generic";
import { DATE_FORMAT } from "../../constants";
import { displayDatetime } from "../../utils/parser";
import "./booking-requests-table-form-data.scss";

interface Props {
  formData: Record<string, unknown>;
  className?: string;
  headerWidth?: SemanticWIDTHS;
  valueWidth?: SemanticWIDTHS;
}

function parseValue(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (value instanceof Array) {
    if (value[0] instanceof Date) {
      value = value.map((val) => displayDatetime(val, DATE_FORMAT));
    }
    return (value as Array<string>).join(", ");
  }
  return value;
}

function BookingRequestsFormData({
  formData,
  className,
  headerWidth,
  valueWidth,
}: Props) {
  return (
    <Grid className={className ?? ""}>
      {Object.entries(formData).map((entry) => (
        <Grid.Row>
          <Grid.Column width={headerWidth ?? 4}>
            <strong>{`${entry[0]}:`}</strong>
          </Grid.Column>
          <Grid.Column width={valueWidth ?? 12}>
            <p>{parseValue(entry[1]) as string}</p>
          </Grid.Column>
        </Grid.Row>
      ))}
    </Grid>
  );
}

export default BookingRequestsFormData;
