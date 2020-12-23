import { saveAs } from "file-saver";
import papaparse from "papaparse";
import { v4 as uuidV4 } from "uuid";
import {
  PendingCreationUser,
  Role,
  roles,
  UserCreationStatus,
} from "../../types/users";
import { EMAIL_REGEX } from "../../constants";

const userCreationCsvTemplate = new Blob(
  [
    papaparse.unparse({
      fields: ["email", "role (optional/default to resident)"],
      data: [
        ["jeremy@example.com", "resident"],
        ["john@example.com", "organizer"],
        ["jenny@example.com", "admin"],
        ["james@another.example.com"],
      ],
    }),
  ],
  { type: "text/csv;charset=utf-8" },
);

export function onDownloadCsvTemplate() {
  saveAs(userCreationCsvTemplate, "user creation template.csv");
}

export function parseCsvDataToPendingCreationUsers(
  data: string[][],
  pendingCreationUsers: PendingCreationUser[],
) {
  const pendingCreationEmails = new Set(
    pendingCreationUsers.map(({ email }) => email),
  );

  const parsedPendingCreationUsers: PendingCreationUser[] = (data as string[][]).map(
    (row) => {
      const email = row?.[0]?.trim().toLowerCase();
      const roleString = row?.[1]?.trim().toUpperCase();
      const role = (roles as string[]).includes(roleString)
        ? (roleString as Role)
        : Role.Resident;

      const pendingCreationUser: PendingCreationUser = {
        uuid: uuidV4(),
        email,
        role,
        status: UserCreationStatus.New,
      };

      if (!email) {
        pendingCreationUser.email = "<empty>";
        pendingCreationUser.status = UserCreationStatus.Invalid;
      } else if (!EMAIL_REGEX.test(email)) {
        pendingCreationUser.status = UserCreationStatus.Invalid;
      } else if (pendingCreationEmails.has(email)) {
        pendingCreationUser.status = UserCreationStatus.Duplicate;
      } else {
        pendingCreationEmails.add(email);
      }

      return pendingCreationUser;
    },
  );

  return parsedPendingCreationUsers;
}
