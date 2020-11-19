import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { AuthenticationData } from "../types/auth";
import { UserData } from "../types/users";

export { default as useOptionsState } from "./use-options-state";
export { default as useStateWithCallback } from "./use-state-with-callback";
export { default as useAllowSignUp } from "./use-allow-sign-up";
export { default as useImageCropperState } from "./use-image-cropper-state";
export { default as useImageUploadCropperState } from "./use-image-upload-cropper-state";

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function useScrollToTop(
  showScrollYOffset?: number,
): [boolean, (behavior: "auto" | "smooth") => void] {
  const [showScroll, setShowScroll] = useState(false);

  const onScroll = useCallback(() => {
    if (showScrollYOffset === undefined) {
      return;
    }

    if (!showScroll && window.pageYOffset > showScrollYOffset) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= showScrollYOffset) {
      setShowScroll(false);
    }
  }, [showScroll, setShowScroll, showScrollYOffset]);

  const scrollToTop = useCallback(
    (behavior: "auto" | "smooth" = "auto") =>
      window.scrollTo({ top: 0, left: 0, behavior }),
    [],
  );

  useEffect(scrollToTop, [scrollToTop]);

  useEffect(() => {
    if (showScrollYOffset !== undefined && showScrollYOffset >= 0) {
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [onScroll, showScrollYOffset]);

  return [showScroll, scrollToTop];
}

const client = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://treeckle.com/api"
      : "http://localhost:8000/api",
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
  params: {
    format: "json",
  },
});

export async function gmailLogin(
  idToken: string,
): Promise<AxiosResponse<AuthenticationData>> {
  return client.post<AuthenticationData>(`login/gmail`, { idToken });
}

export async function inviteUsers(emails: string[]): Promise<AxiosResponse> {
  return client.post(`/users/invite`, { emails });
}

export async function deleteUserInvite(id: number): Promise<AxiosResponse> {
  return client.delete(`/users/invite/${id}`);
}

export async function getUsersOfOwnOrganisation(): Promise<
  AxiosResponse<{ users: UserData[] }>
> {
  return client.get(`users`);
}

export async function patchUser(
  id: number,
  role: string,
): Promise<AxiosResponse> {
  return client.patch(`users/${id}`, { role });
}

export async function deleteUser(id: number): Promise<AxiosResponse> {
  return client.delete(`users/${id}`);
}

export async function addOrganisationListeners(
  emails: string[],
): Promise<AxiosResponse<{ accepted: string[]; rejected: string[] }>> {
  return client.post(`/organisations/listeners`, { emails });
}

export async function getOrganisationListeners(): Promise<
  AxiosResponse<{ listeners: string[] }>
> {
  return client.get(`/organisations/listeners`);
}

export async function deleteOrganisationListener(
  id: number,
): Promise<AxiosResponse> {
  return client.delete(`/organisations/listeners/${id}`);
}

export async function setClientData(data: AuthenticationData) {
  const { accessToken } = data;
  client.defaults.headers.common.authorization = `${accessToken}`;
}

export function useGmailLogin() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleResponse = async (response: any) => {
    const idToken = response.tokenObj.id_token;
    console.log(idToken);
    await gmailLogin(idToken)
      .then((response) => {
        const { data } = response;
        const { accessToken } = data;
        client.defaults.headers.common.authorization = `${accessToken}`;
      })
      .catch(console.log);

    await getUsersOfOwnOrganisation().then(console.log).catch(console.log);
  };

  /* Tests for venue apis
    const venuePostData: VenuePostData = {
      name: "new venue 1",
      formData: "To be changed to json string",
      categoryName: "category One",
    };

    await createVenue(venuePostData).then(console.log).catch(console.log);
  
    await deleteVenue(5).then(console.log).catch(console.log);
    const updatedData: VenuePutData = {
      name: "new venue 1",
      formData: "i updated this",
      categoryName: "category t2e",
    };

    await updateVenue(4, updatedData).then(console.log).catch(console.log);
    await getVenuesOfOwnOrganisation().then(console.log).catch(console.log);
  */

  /* Tests for event apis
    setClientData(data);
    
    const eventPostData: EventPostData = {
      title: "new title 2",
      organisedBy: "some CCA",
      venueName: "at NUS 2",
      description: "a descriptions? 2",
      capacity: null,
      startDate: new Date(),
      endDate: new Date(),
      image: "some cool image 2",
      isPublished: true,
      isSignUpAllowed: true,
      isSignUpApprovalRequired: false,
      categories: ["cat1", "cat2", "cat 4"],
    };
        
    await createEvent(eventPostData).then(console.log).catch(console.log);

    const eventPutData: EventPutData = {
      title: "new title 200",
      organisedBy: "some CCA2"
      venueName: "at NUS 200",
      description: "a descriptions? 200",
      capacity: null,
      startDate: new Date(),
      endDate: new Date(),
      image: "some cool image 300",
      isPublished: true,
      isSignUpAllowed: true,
      isSignUpApprovalRequired: false,
      categories: ["cat 4"],
    };
    await updateEvent(7, eventPutData).then(console.log).catch(console.log);

    await getEventsOfOwnOrganisation().then(console.log).catch(console.log);
    
    await getSelfCreatedEvents().then(console.log).catch(console.log);
    
    await getEventsSignedUpFor()

    await getEvent(8)

    await deleteEvent(8).then(console.log).catch(console.log);

    await signUpForEvent(8).then(console.log).catch(console.log);
    
    await removeSignUpForEvent(8).then(console.log).catch(console.log);

    const signUpPatchData: SignUpPatchData = {
      actions: [
        {action: SignUpActionType.REJECT, userId: 1},
        {action: SignUpActionType.CONFIRM, userId: 4},
      ]
    }
    await patchSignUps(8, signUpPatchData).then(console.log).catch(console.log);

    const subscriptionPatchData: SubscriptionPatchData = {
      actions: [
        { action: SubscribeActionType.SUBSCRIBE, categoryName: "sports" },
        { action: SubscribeActionType.UNSUBSCRIBE, categoryName: "music" },
      ]
    }
    await patchSubscriptions(subscriptionPatchData).then(console.log).catch(console.log);

    await getOwnSubscriptions()

    await getSubscribedEvents()
)
  */

  return [handleGoogleResponse];
}
