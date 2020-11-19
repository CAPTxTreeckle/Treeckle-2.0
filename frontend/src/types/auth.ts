import { UserData } from "./users";

export type AuthenticationData = {
  user: UserData;
  accessToken: string;
  refreshToken: string;
};

export type NusnetAuthenticationData = {
  email: string;
  name: string;
  nusnetId: string;
};
