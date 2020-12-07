import { EMAIL, ID, NAME, ORGANIZATION, ROLE, STATUS } from "../constants";
import { BaseData } from "./base";

export enum Role {
  Admin = "ADMIN",
  Organizer = "ORGANIZER",
  Resident = "RESIDENT",
}

export const roles = Object.values(Role);

export type UserInviteData = BaseData & {
  [EMAIL]: string;
  [ROLE]: Role;
  [ORGANIZATION]: string;
};

export type UserData = UserInviteData & {
  [NAME]: string;
};

export type UserInvitePostData = {
  [EMAIL]: string;
  [ROLE]: Role;
};

export type UserInvitePatchData = {
  [ID]: number;
  [ROLE]?: Role;
};

export type UserPatchData = {
  [ID]: number;
  [NAME]?: string;
  [EMAIL]?: string;
  [ROLE]?: Role;
};

export enum UserCreationStatus {
  Created = "CREATED",
  Invalid = "INVALID",
  Duplicated = "DUPLICATED",
  New = "NEW",
}

export type PendingCreationUser = {
  [EMAIL]: string;
  [ROLE]: Role;
  [STATUS]: UserCreationStatus;
};
