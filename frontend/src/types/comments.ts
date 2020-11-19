import { BaseData } from "./base";

export type BookingRequestCommentsData = BaseData & {
  userId: number;
  name: string;
  content: string;
};
