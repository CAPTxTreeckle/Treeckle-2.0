import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DATE_TIME_FORMAT } from "../constants";
import { User } from "../context-providers/user-provider";
import { UserData } from "../types/users";

dayjs.extend(customParseFormat);

export function parseDataUrlToEncodedData(dataUrl: string): string {
  const partition = dataUrl.split(",");
  const encodedData = partition?.[1];
  return encodedData ?? "";
}

export function getMimeTypeFromDataUrl(dataUrl: string): string {
  return dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
}

export function sanitiseArray(strings: string[]): string[] {
  return Array.from(new Set(strings.map((s) => s.trim()).filter((s) => s)));
}

export function displayDatetime(datetime: Date, format?: string): string {
  return dayjs(datetime).format(format ?? DATE_TIME_FORMAT);
}

export function parseDatetime(datetimeString: string, format?: string): Date {
  return dayjs(datetimeString, format ?? DATE_TIME_FORMAT).toDate();
}

export function parseStringToInt(s?: string): number | null {
  const value = parseInt(s ?? "", 10);
  return Number.isNaN(value) ? null : value ?? null;
}

export function parseUserToUserData(user: User) {
  const { id, name, email, role, organisation } = user ?? {};

  if (
    [id, name, email, role, organisation].some((value) => value === undefined)
  ) {
    return undefined;
  }

  return { id, name, email, role, organisation } as UserData;
}
