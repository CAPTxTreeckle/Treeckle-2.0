import React from "react";
import { BookingsProvider } from "../../context-providers";
import BookingAdminTable from "../booking-admin-table";

function BookingAdminSection() {
  return (
    <BookingsProvider>
      <BookingAdminTable />
    </BookingsProvider>
  );
}

export default BookingAdminSection;
