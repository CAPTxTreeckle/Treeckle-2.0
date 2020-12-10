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

export function sanitizeArray(strings: string[], unique = true): string[] {
  if (unique) {
    return Array.from(new Set(strings.map((s) => s.trim()).filter((s) => s)));
  }
  return strings.map((s) => s.trim()).filter((s) => s);
}

export function displayDatetime(
  datetime: number,
  format: string = DATE_TIME_FORMAT,
): string {
  return dayjs(datetime).format(format);
}

export function parseDatetime(
  datetimeString: string,
  format: string = DATE_TIME_FORMAT,
): Date {
  return dayjs(datetimeString, format).toDate();
}

export function parseUserToUserData(user: User) {
  const { id, name, email, role, organization } = user ?? {};

  if ([id, name, email, role, organization].includes(undefined)) {
    return undefined;
  }

  return { id, name, email, role, organization } as UserData;
}

export function parseToTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0) + txt.substr(1).toLowerCase(),
  );
}
