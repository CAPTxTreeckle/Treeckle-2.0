import React, { useCallback } from "react";
import { toast } from "react-toastify";
import {
  useGetOrganizationListeners,
  useCreateOrganizationListeners,
  useDeleteOrganizationListeners,
} from "../custom-hooks/api";
import {
  OrganizationListenerPostData,
  OrganizationListenerViewProps,
} from "../types/organizations";
import { resolveApiError } from "../utils/error-utils";

type BookingNotificationSubscriptionContextType = {
  bookingNotificationSubscribers: OrganizationListenerViewProps[];
  isLoading: boolean;
  getBookingNotificationSubscribers: () => Promise<
    OrganizationListenerViewProps[]
  >;
  createBookingNotificationSubscribers: (
    subscribers: OrganizationListenerPostData[],
  ) => Promise<boolean>;
  deleteBookingNotificationSubscribers: (ids: number[]) => Promise<boolean>;
};

export const BookingNotificationSubscriptionContext = React.createContext<BookingNotificationSubscriptionContextType>(
  {
    bookingNotificationSubscribers: [],
    isLoading: false,
    getBookingNotificationSubscribers: () => {
      throw new Error("getBookingNotificationSubscribers not defined.");
    },
    createBookingNotificationSubscribers: () => {
      throw new Error("createBookingNotificationSubscribers not defined.");
    },
    deleteBookingNotificationSubscribers: () => {
      throw new Error("deleteBookingNotificationSubscribers not defined.");
    },
  },
);

type Props = {
  children: React.ReactNode;
};

function BookingNotificationSubscriptionProvider({ children }: Props) {
  const {
    organizationListeners,
    getOrganizationListeners,
    isLoading,
  } = useGetOrganizationListeners();
  const { createOrganizationListeners } = useCreateOrganizationListeners();
  const { deleteOrganizationListeners } = useDeleteOrganizationListeners();

  const createBookingNotificationSubscribers = useCallback(
    async (subscribers: OrganizationListenerPostData[]) => {
      try {
        const new_subscribers = await createOrganizationListeners(subscribers);
        getOrganizationListeners();

        toast.success(
          new_subscribers.length > 1
            ? "New subscribers added successfully."
            : "The new subscriber has been added successfully.",
        );

        return true;
      } catch (error) {
        resolveApiError(error);
        return false;
      }
    },
    [createOrganizationListeners, getOrganizationListeners],
  );

  const deleteBookingNotificationSubscribers = useCallback(
    async (ids: number[]) => {
      try {
        const deleted_subscribers = await deleteOrganizationListeners(ids);
        getOrganizationListeners();

        toast.success(
          deleted_subscribers.length > 1
            ? "Subscribers removed successfully."
            : "The subscriber has been removed successfully.",
        );

        return true;
      } catch (error) {
        resolveApiError(error);
        return false;
      }
    },
    [deleteOrganizationListeners, getOrganizationListeners],
  );

  return (
    <BookingNotificationSubscriptionContext.Provider
      value={{
        bookingNotificationSubscribers: organizationListeners,
        isLoading,
        getBookingNotificationSubscribers: getOrganizationListeners,
        createBookingNotificationSubscribers,
        deleteBookingNotificationSubscribers,
      }}
    >
      {children}
    </BookingNotificationSubscriptionContext.Provider>
  );
}

export default BookingNotificationSubscriptionProvider;
