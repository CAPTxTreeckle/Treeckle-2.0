import { v4 as uuidV4 } from "uuid";
import { COMMA_NEWLINE_REGEX, EMAIL_REGEX } from "../../constants";
import {
  PendingCreationUser,
  Role,
  UserCreationStatus,
} from "../../types/users";
import { sanitizeArray } from "../../utils/parser-utils";

export function parseInputDataToPendingCreationUsers(
  data: string,
  role: Role,
  pendingCreationUsers: PendingCreationUser[],
) {
  const parsedWords = data
    .trim()
    .replace(COMMA_NEWLINE_REGEX, " ")
    .toLowerCase()
    .split(" ");

  const sanitizedWords = sanitizeArray(parsedWords, false);
  const pendingCreationEmails = new Set(
    pendingCreationUsers.map(({ email }) => email),
  );

  const parsedPendingCreationUsers: PendingCreationUser[] = sanitizedWords.map(
    (email) => {
      const pendingCreationUser: PendingCreationUser = {
        uuid: uuidV4(),
        email,
        role,
        status: UserCreationStatus.New,
      };

      if (!EMAIL_REGEX.test(email)) {
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
