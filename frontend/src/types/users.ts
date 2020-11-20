export enum Role {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  RESIDENT = "RESIDENT",
}

export type UserData = {
  id: number;
  email: string;
  name: string;
  role: Role;
  organization: string;
};
