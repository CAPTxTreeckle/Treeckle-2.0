import { UserData } from "./users";

export type AuthenticationData = UserData & {
  access: string;
  refresh: string;
};

export type OpenIdAuthenticationData = {
  email: string;
  name: string;
  userId: string;
};
