import { BaseData } from "./base";
import {
  CATEGORY,
  FIELD_LABEL,
  FIELD_TYPE,
  PLACEHOLDER_TEXT,
  RECOMMENDED_CAPACITY,
  REQUIRED_FIELD,
  VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION,
  VENUE_IC_CONTACT_NUMBER,
  VENUE_IC_EMAIL,
  VENUE_IC_NAME,
  VENUE_NAME,
} from "../constants";

export type VenuePostData = {
  name: string;
  formData: string;
  category: string;
};

export type VenuePutData = VenuePostData;

type VenueMetaData = BaseData;

export type VenueData = VenueMetaData & VenuePostData;

export enum FieldType {
  TEXT = "text",
  TEXT_AREA = "text-area",
  NUMBER = "number",
  BOOLEAN = "boolean",
}

export type VenueCustomFormFieldProps = {
  [FIELD_TYPE]: FieldType;
  [FIELD_LABEL]: string;
  [PLACEHOLDER_TEXT]?: string;
  [REQUIRED_FIELD]?: boolean;
};

export type VenueFormProps = {
  [VENUE_NAME]: string;
  [CATEGORY]: string;
  [RECOMMENDED_CAPACITY]?: string;
  [VENUE_IC_NAME]?: string;
  [VENUE_IC_EMAIL]?: string;
  [VENUE_IC_CONTACT_NUMBER]?: string;
  [VENUE_DETAILS_CUSTOM_FORM_FIELDS_SECTION]?: VenueCustomFormFieldProps[];
};

export type VenueViewProps = VenueMetaData & {
  venueFormProps: VenueFormProps;
};
