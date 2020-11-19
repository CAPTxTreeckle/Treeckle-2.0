import React, { useContext } from "react";
import { AllBookingRequestsContext } from "../../../context-providers";
import BookingRequestsTable from "../../bookings-requests-table";

function AdminBookingsPage() {
  const { bookingRequests, isLoading, getBookingRequests } = useContext(
    AllBookingRequestsContext,
  );

  React.useEffect(() => {
    (async () => {
      await getBookingRequests();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Booking Requests</h1>
      <BookingRequestsTable
        bookingRequests={bookingRequests}
        isLoadingRequests={isLoading}
        getBookingRequests={getBookingRequests}
        isAdminTable
      />
    </div>
  );
}

export default AdminBookingsPage;
