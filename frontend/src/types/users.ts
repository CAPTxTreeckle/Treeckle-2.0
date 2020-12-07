import { BaseData } from "./base";

export enum Role {
  Admin = "ADMIN",
  Organizer = "ORGANIZER",
  Resident = "RESIDENT",
}

export const roles = Object.values(Role);

export type UserInviteData = BaseData & {
  email: string;
  role: Role;
  organization: string;
};

export type UserData = UserInviteData & {
  name: string;
};

export type UserInvitePostData = {
  email: string;
  role: Role;
};

export type UserInvitePatchData = {
  id: number;
  role?: Role;
};

export type UserPatchData = {
  id: number;
  name?: string;
  email?: string;
  role?: Role;
};

export enum UserCreationStatus {
  Created = "CREATED",
  Invalid = "INVALID",
  Duplicated = "DUPLICATED",
  New = "NEW",
}

export type PendingCreationUser = {
  email: string;
  role: Role;
  status: UserCreationStatus;
};
