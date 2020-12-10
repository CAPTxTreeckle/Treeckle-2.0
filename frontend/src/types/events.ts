import {
  ACTION,
  ACTIONS,
  CAPACITY,
  CATEGORIES,
  CATEGORY,
  DESCRIPTION,
  END_DATE_TIME,
  EVENT,
  EVENT_ID,
  IMAGE,
  IS_PUBLISHED,
  IS_SIGN_UP_ALLOWED,
  IS_SIGN_UP_APPROVAL_REQUIRED,
  ORGANIZED_BY,
  ORGANIZER,
  SIGN_UPS,
  SIGN_UP_COUNT,
  SIGN_UP_STATUS,
  START_DATE_TIME,
  STATUS,
  TITLE,
  USER,
  USER_ID,
  VENUE_NAME,
} from "../constants";

import { BaseData } from "./base";
import { UserData } from "./users";

export type EventPostData = {
  [TITLE]: string;
  [ORGANIZED_BY]: string;
  [VENUE_NAME]: string;
  [CAPACITY]: string | null;
  [DESCRIPTION]: string;
  [START_DATE_TIME]: number;
  [END_DATE_TIME]: number;
  [IMAGE]: string;
  [IS_PUBLISHED]: boolean;
  [IS_SIGN_UP_ALLOWED]: boolean;
  [IS_SIGN_UP_APPROVAL_REQUIRED]: boolean;
  [CATEGORIES]: string[];
};

export type EventPutData = EventPostData;

type EventMetaData = BaseData & {
  [ORGANIZER]: UserData;
  [SIGN_UP_COUNT]: number;
  [SIGN_UP_STATUS]: SignUpStatus | null;
};

export type EventData = EventMetaData & EventPostData;

export type EventWithSignUpsData = {
  [EVENT]: EventData;
  [SIGN_UPS]: SignUpData[];
};

export enum SignUpStatus {
  Pending = "PENDING",
  Confirmed = "CONFIRMED",
  Attended = "ATTENDED",
}

export type SignUpData = BaseData & {
  [USER]: UserData;
  [EVENT_ID]: number;
  [STATUS]: SignUpStatus;
};

export enum SignUpActionType {
  Attend = "ATTEND",
  Confirm = "CONFIRM",
  Reject = "REJECT",
}

export type SignUpAction = {
  [ACTION]: SignUpActionType;
  [USER_ID]: number;
};

export type SignUpPatchData = {
  [ACTIONS]: SignUpAction[];
};

export type EventFormProps = {
  [TITLE]: string;
  [ORGANIZED_BY]: string;
  [VENUE_NAME]: string;
  [CATEGORIES]: string[];
  [CAPACITY]: string;
  [START_DATE_TIME]: number;
  [END_DATE_TIME]: number;
  [DESCRIPTION]: string;
  [IMAGE]: string;
  [IS_SIGN_UP_ALLOWED]: boolean;
  [IS_SIGN_UP_APPROVAL_REQUIRED]: boolean;
  [IS_PUBLISHED]: boolean;
};

export type EventViewProps = EventMetaData & { signUps?: SignUpData[] } & {
  eventFormProps: EventFormProps;
};

export enum SubscribeActionType {
  Subscribe = "SUBSCRIBE",
  Unsubscribe = "UNSUBSCRIBE",
}

export type SubscribeAction = {
  [ACTION]: SubscribeActionType;
  [CATEGORY]: string;
};

export type SubscriptionPatchData = {
  [ACTIONS]: SubscribeAction[];
};

export type SubscriptionData = {
  subscribedCategories: string[];
  notSubscribedCategories: string[];
};
