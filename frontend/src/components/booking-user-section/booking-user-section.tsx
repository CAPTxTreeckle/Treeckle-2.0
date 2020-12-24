import { useContext, useMemo } from "react";
import { USER_ID } from "../../constants";
import { BookingsProvider, UserContext } from "../../context-providers";
import { BookingGetQueryParams } from "../../types/bookings";
import BookingUserTable from "../booking-user-table";

function BookingUserSection() {
  const { id } = useContext(UserContext);
  const defaultQueryParams: BookingGetQueryParams = useMemo(
    () => ({ [USER_ID]: id }),
    [id],
  );

  return (
    <BookingsProvider defaultQueryParams={defaultQueryParams}>
      <BookingUserTable />
    </BookingsProvider>
  );
}

export default BookingUserSection;
