import React, { useContext, useState } from "react";
import CreateBookingRequestProvider from "../../../context-providers/create-booking-request-provider";
import { OwnBookingRequestsContext } from "../../../context-providers/own-booking-requests-provider";
import CreateBookingRequestsButton from "../../booking-requests-create-button";
import BookingRequestsTable from "../../bookings-requests-table";
import CreateBookingRequestModal from "../../create-booking-request-modal";
import "./bookings-page.scss";

function BookingsPage() {
  const { bookingRequests, isLoading, getBookingRequests } = useContext(
    OwnBookingRequestsContext,
  );

  const [
    isCreateBookingRequestModalOpen,
    setIsCreateBookingRequestModalOpen,
  ] = useState(false);

  React.useEffect(() => {
    (async () => {
      await getBookingRequests();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bookings-page-container">
      <CreateBookingRequestProvider>
        <CreateBookingRequestModal
          setIsCreateBookingRequestModalOpen={
            setIsCreateBookingRequestModalOpen
          }
          isCreateBookingRequestModalOpen={isCreateBookingRequestModalOpen}
        />
      </CreateBookingRequestProvider>
      <h1>My Bookings</h1>
      <CreateBookingRequestsButton
        className="bookings-page-create-bookings-button"
        onClick={() => setIsCreateBookingRequestModalOpen(true)}
      />
      <BookingRequestsTable
        bookingRequests={bookingRequests}
        isLoadingRequests={isLoading}
        getBookingRequests={getBookingRequests}
        isAdminTable={false}
      />
    </div>
  );
}

export default BookingsPage;
