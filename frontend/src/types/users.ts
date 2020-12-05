import { BaseData } from "./base";

export enum Role {
  Admin = "Admin",
  Organizer = "Organizer",
  Resident = "Resident",
}

export type UserInviteData = BaseData & {
  email: string;
  role: Role;
  organization: string;
};

export type UserData = UserInviteData & {
  name: string;
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
