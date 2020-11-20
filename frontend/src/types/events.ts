import {
  ALLOW_SIGN_UP,
  CATEGORIES,
  DESCRIPTION,
  END_DATE_TIME,
  ESTIMATED_CAPACITY,
  EVENT_TITLE,
  IMAGE,
  ORGANISED_BY,
  PUBLISH,
  SIGN_UP_REQUIRE_APPROVAL,
  START_DATE_TIME,
  VENUE_NAME,
} from "../constants";

import { BaseData } from "./base";
import { UserData } from "./users";

export type EventPostData = {
  title: string;
  capacity?: number | null;
  description: string;
  organisedBy: string;
  venueName: string;
  startDate: Date;
  endDate: Date;
  image: string;
  isPublished: boolean;
  isSignUpAllowed: boolean;
  isSignUpApprovalRequired: boolean;
  categories: string[];
};

export type EventPutData = EventPostData;

type EventMetaData = BaseData & {
  organizer: UserData;
  signUpCount: number;
  signUpStatus: SignUpStatus | null;
};

export type EventData = EventMetaData & EventPostData;

export type EventWithSignUpsData = { event: EventData; signUps: SignUpData[] };

export enum SignUpStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  ATTENDED = "ATTENDED",
}

export type SignUpData = BaseData & {
  user: UserData;
  eventId: number;
  status: SignUpStatus;
};

export enum SignUpActionType {
  ATTEND = "ATTEND",
  CONFIRM = "CONFIRM",
  REJECT = "REJECT",
}

export type SignUpAction = {
  action: SignUpActionType;
  userId: number;
};

export type SignUpPatchData = {
  actions: SignUpAction[];
};

export type EventFormProps = {
  [EVENT_TITLE]: string;
  [ORGANISED_BY]: string;
  [VENUE_NAME]?: string;
  [CATEGORIES]?: string[];
  [ESTIMATED_CAPACITY]?: string;
  [START_DATE_TIME]: Date;
  [END_DATE_TIME]: Date;
  [DESCRIPTION]?: string;
  [IMAGE]?: string;
  [ALLOW_SIGN_UP]: boolean;
  [SIGN_UP_REQUIRE_APPROVAL]: boolean;
  [PUBLISH]: boolean;
};

export type EventViewProps = EventMetaData & { signUps?: SignUpData[] } & {
  eventFormProps: EventFormProps;
};

export enum SubscribeActionType {
  SUBSCRIBE = "SUBSCRIBE",
  UNSUBSCRIBE = "UNSUBSCRIBE",
}

export type SubscribeAction = {
  action: SubscribeActionType;
  categoryName: string;
};

export type SubscriptionPatchData = {
  actions: SubscribeAction[];
};

export type SubscriptionData = {
  subscribedCategories: string[];
  notSubscribedCategories: string[];
};
