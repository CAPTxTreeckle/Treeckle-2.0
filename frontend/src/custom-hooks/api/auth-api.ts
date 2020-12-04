import { useCallback, useContext, useState } from "react";
import useAxios, { Options, RefetchOptions, ResponseValues } from "axios-hooks";
import { StatusCodes } from "http-status-codes";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from "react-google-login";
import { toast } from "react-toastify";
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "axios";
import { useHistory } from "react-router-dom";
import { HOME_PATH, OPEN_ID_PATH } from "../../routes";
import { AuthenticationData, OpenIdAuthenticationData } from "../../types/auth";
import { UserContext } from "../../context-providers";
import { User } from "../../context-providers/user-provider";

function syncUserContext(
  setUser: (user: User | null) => void,
  data: AuthenticationData,
) {
  const { access, refresh, id, name, email, role, organization } = data;
  setUser({
    accessToken: access,
    refreshToken: refresh,
    id,
    name,
    email,
    role,
    organization,
  });
}

export function useAxiosWithTokenRefresh<T>(
  config: AxiosRequestConfig,
  options?: Options,
): [
  ResponseValues<T, Error>,
  (config?: AxiosRequestConfig, options?: RefetchOptions) => AxiosPromise<T>,
] {
  const { accessToken, refreshToken, setUser } = useContext(UserContext);
  const [responseValues, apiCall] = useAxios<T>(
    {
      ...config,
      headers: {
        ...(config?.headers ?? {}),
        authorization: `Bearer ${accessToken}`,
      },
    },
    {
      ...(options ?? {}),
      manual: true,
    },
  );
  const [, tokenRefresh] = useAxios<AuthenticationData>(
    {
      url: "/gateway/refresh",
      method: "post",
      data: { refresh: refreshToken },
    },
    { manual: true },
  );
  const [isLoading, setLoading] = useState(false);

  const apiCallWithTokenRefresh = useCallback(
    async (
      config?: AxiosRequestConfig,
      options?: RefetchOptions,
    ): Promise<AxiosResponse<T>> => {
      let attemptedTokenRefresh = false;
      try {
        setLoading(true);
        const response = await apiCall(config, options);
        return response;
      } catch (error) {
        try {
          console.log("Error before token refresh:", error, error?.response);
          if (error?.toString() === "Cancel") {
            throw error;
          }
          console.log("Attempting to refresh token");
          attemptedTokenRefresh = true;
          const { data } = await tokenRefresh();

          const response = await apiCall(
            {
              ...(config ?? {}),
              headers: { authorization: `${data.access}` },
            },
            options,
          );

          syncUserContext(setUser, data);
          return response;
        } catch (error) {
          attemptedTokenRefresh &&
            console.log("Error after token refresh:", error, error?.response);
          if (
            [StatusCodes.UNAUTHORIZED, StatusCodes.FORBIDDEN].some(
              (statusCode) => error?.response?.status === statusCode,
            )
          ) {
            // kick user out
            setUser(null);
            toast.error(
              "Your current session has expired. Please log in again.",
            );
          }
          throw error;
        }
      } finally {
        setLoading(false);
      }
    },
    [apiCall, setUser, tokenRefresh],
  );

  return [{ ...responseValues, loading: isLoading }, apiCallWithTokenRefresh];
}

export function useGoogleAuth() {
  const { setUser } = useContext(UserContext);
  const [{ loading }, login] = useAxios<AuthenticationData>(
    {
      url: "/gateway/gmail",
      method: "post",
    },
    { manual: true },
  );

  const { signIn, loaded } = useGoogleLogin({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
    cookiePolicy: "single_host_origin",
    onSuccess: async (
      response: GoogleLoginResponse | GoogleLoginResponseOffline,
    ) => {
      try {
        const { tokenId } = response as GoogleLoginResponse;
        const { data } = await login({ data: { tokenId } });
        console.log("POST /gateway/gmail success:", data);
        syncUserContext(setUser, data);
        toast.success("Signed in successfully.");
      } catch (error) {
        console.log("POST /gateway/gmail error:", error, error?.response);
        toast.error("Invalid user.");
      }
    },
    onFailure: (error) => {
      console.log("Google Client error:", error, error?.response);
      toast.error("An unknown error has occurred.");
    },
  });

  return { startGoogleAuth: signIn, isLoading: !loaded || loading };
}

export function useOpenIdAuth() {
  const { setUser } = useContext(UserContext);
  const history = useHistory();
  const [, login] = useAxios<AuthenticationData>(
    {
      url: "/gateway/openid",
      method: "post",
    },
    { manual: true },
  );

  const startOpenIdAuth = useCallback(() => {
    const url = [
      "https://openid.nus.edu.sg/server/",
      "?openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select",
      "&openid.identity=http://specs.openid.net/auth/2.0/identifier_select",
      "&openid.mode=checkid_setup",
      "&openid.ns=http://specs.openid.net/auth/2.0",
      "&openid.sreg.required=email,nickname,fullname",
      "&openid.identity=http://specs.openid.net/auth/2.0/identifier_select",
      `&openid.return_to=${window.location.origin}${OPEN_ID_PATH}`,
    ].join("");
    window.open(url, "_self");
  }, []);

  const authenticate = useCallback(
    async (openIdData: OpenIdAuthenticationData) => {
      try {
        const { data } = await login({ data: openIdData });
        console.log("POST /gateway/openid success:", data);
        syncUserContext(setUser, data);
        toast.success("Signed in successfully.");
      } catch (error) {
        console.log("POST /gateway/openid error:", error, error?.response);
        toast.error(
          error?.response?.data?.detail ?? "An unknown error has occurred.",
        );
        history.push(HOME_PATH);
      }
    },
    [login, setUser, history],
  );

  return { startOpenIdAuth, authenticate };
}
