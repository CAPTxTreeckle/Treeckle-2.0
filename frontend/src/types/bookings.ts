import {
  ACTION,
  ACTIONS,
  BOOKER,
  BOOKING_ID,
  CUSTOM_BOOKING_FORM_RESPONSES,
  DATE_TIME_RANGES,
  END_DATE_TIME,
  FIELD_LABEL,
  FIELD_RESPONSE,
  FORM_RESPONSE_DATA,
  START_DATE_TIME,
  STATUS,
  TITLE,
  VENUE_ID,
  VENUE_NAME,
} from "../constants";
import { BaseData } from "./base";
import { UserData } from "./users";

export type BookingPostData = {
  [TITLE]: string;
  [VENUE_ID]: number;
  [DATE_TIME_RANGES]: DateTimeRange[];
  [FORM_RESPONSE_DATA]: CustomBookingFormResponseProps[];
};

export type DateTimeRange = {
  [START_DATE_TIME]: number;
  [END_DATE_TIME]: number;
};

export type BookingData = BaseData & {
  [TITLE]: string;
  [BOOKER]: UserData;
  [VENUE_NAME]: string;
  [START_DATE_TIME]: number;
  [END_DATE_TIME]: number;
  [STATUS]: BookingStatus;
  [FORM_RESPONSE_DATA]: CustomBookingFormResponseProps[];
};

export type CustomBookingFormResponseProps = {
  [FIELD_LABEL]: string;
  [FIELD_RESPONSE]: string;
};

export type BookingPatchData = {
  [ACTIONS]: BookingStatusAction[];
};

export type BookingStatusAction = {
  [BOOKING_ID]: number;
  [ACTION]: BookingStatusActionType;
};

export enum BookingStatusActionType {
  Revoke = "REVOKE",
  Approve = "APPROVE",
  Reject = "REJECT",
  Cancel = "CANCEL",
}

export enum BookingStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
  Cancelled = "CANCELLED",
}

export type BookingFormProps = {
  [CUSTOM_BOOKING_FORM_RESPONSES]: CustomBookingFormResponseProps[];
};
