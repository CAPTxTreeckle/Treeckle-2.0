import React from "react";
import { BookingsProvider } from "../../context-providers";
import BookingUserTable from "../booking-user-table";

function BookingUserSection() {
  return (
    <BookingsProvider>
      <BookingUserTable />
    </BookingsProvider>
  );
}

export default BookingUserSection;
