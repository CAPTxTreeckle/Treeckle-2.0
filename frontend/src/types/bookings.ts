import { BaseData } from "./base";

export type BookingRequestBaseData = {
  venue: number | string;
  startDate: string | Date;
  endDate: string | Date;
  status: number;
  formData: string;
};

export type BookingRequestPostData = {
  booker: number;
  venue: number;
  start_date: string;
  end_date: string;
  status: number;
  form_data: string;
};

export type BookingRequestData = (BaseData & BookingRequestBaseData) & {
  name: string;
  email: string;
  venue: string;
};

export enum BookingRequestStatus {
  Pending = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
}
