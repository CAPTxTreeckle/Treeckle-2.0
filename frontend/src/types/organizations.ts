import { EMAIL, IDS, NAME } from "../constants";
import { BaseData } from "./base";

export type OrganizationListenerData = BaseData & {
  [NAME]: string;
  [EMAIL]: string;
};

export type OrganizationListenerPostData = {
  [NAME]: string;
  [EMAIL]: string;
};

export type OrganizationListenerDeleteData = {
  [IDS]: number[];
};

export type OrganizationListenerViewProps = OrganizationListenerData;
