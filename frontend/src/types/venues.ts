import { BaseData } from "./base";
import {
  CATEGORY,
  FIELD_LABEL,
  FIELD_TYPE,
  PLACEHOLDER_TEXT,
  CAPACITY,
  REQUIRED_FIELD,
  VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION,
  IC_CONTACT_NUMBER,
  IC_EMAIL,
  IC_NAME,
  NAME,
  FORM_FIELD_DATA,
} from "../constants";

export type VenuePostData = {
  [NAME]: string;
  [CATEGORY]: string;
  [CAPACITY]: string | null;
  [IC_NAME]: string;
  [IC_EMAIL]: string;
  [IC_CONTACT_NUMBER]: string;
  [FORM_FIELD_DATA]: VenueCustomFormFieldProps[];
};

export type VenuePutData = VenuePostData;

export type VenueData = BaseData & VenuePostData;

export enum FieldType {
  TEXT = "text",
  TEXT_AREA = "text-area",
  NUMBER = "number",
  BOOLEAN = "boolean",
}

export type VenueCustomFormFieldProps = {
  [FIELD_TYPE]: FieldType;
  [FIELD_LABEL]: string;
  [PLACEHOLDER_TEXT]: string;
  [REQUIRED_FIELD]: boolean;
};

export type VenueFormProps = {
  [NAME]: string;
  [CATEGORY]: string;
  [CAPACITY]: string;
  [IC_NAME]: string;
  [IC_EMAIL]: string;
  [IC_CONTACT_NUMBER]: string;
  [VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION]?: VenueCustomFormFieldProps[];
};

export type VenueViewProps = BaseData & {
  venueFormProps: VenueFormProps;
};
