import { format, parse } from "date-fns";
import { DATE_TIME_FORMAT } from "../constants";
import { User } from "../context-providers/user-provider";
import { UserData } from "../types/users";

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

export function deepTrim<T>(value: T): T {
  const unknownValue = value as unknown;

  if (Array.isArray(unknownValue)) {
    return (unknownValue.map((item) => deepTrim(item)) as unknown) as T;
  }

  if (typeof unknownValue === "object" && unknownValue !== null) {
    return Object.keys(unknownValue).reduce((all, key) => {
      all[key] = deepTrim((unknownValue as Record<string, unknown>)[key]);
      return all;
    }, {} as Record<string, unknown>) as T;
  }

  if (typeof unknownValue === "string") {
    return (unknownValue.trim() as unknown) as T;
  }

  return value;
}

export function displayDateTime(
  dateTime: number | Date,
  dateTimeFormat: string = DATE_TIME_FORMAT,
): string {
  return format(dateTime, dateTimeFormat);
}

export function parseDateTime(
  dateTimeString: string,
  dateTimeFormat: string = DATE_TIME_FORMAT,
): number {
  return parse(dateTimeString, dateTimeFormat, new Date()).getTime();
}

export function parseUserToUserData(user: User) {
  const { id, name, email, role, organization } = { ...user };

  if ([id, name, email, role, organization].includes(undefined)) {
    return undefined;
  }

  return { id, name, email, role, organization } as UserData;
}

export function parseStringToTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0) + txt.substr(1).toLowerCase(),
  );
}

export function parseLowerCamelCaseToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function parseQueryParamsToUrl(
  baseUrl: string,
  queryParams?: Partial<Record<string, unknown>>,
) {
  if (queryParams === undefined) {
    return baseUrl;
  }

  const queryString = Object.entries(queryParams)
    .flatMap(([key, value]) =>
      value !== undefined && value !== ""
        ? [[parseLowerCamelCaseToSnakeCase(key), String(value)].join("=")]
        : [],
    )
    .join("&");

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
