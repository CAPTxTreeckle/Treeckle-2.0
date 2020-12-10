import { ACCESS, EMAIL, NAME, REFRESH, USER_ID } from "../constants";
import { UserData } from "./users";

export type AuthenticationData = UserData & {
  [ACCESS]: string;
  [REFRESH]: string;
};

export type OpenIdAuthenticationData = {
  [EMAIL]: string;
  [NAME]: string;
  [USER_ID]: string;
};
