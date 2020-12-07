import classNames from "classnames";
import { defaultTableRowRenderer, TableRowProps } from "react-virtualized";
import {
  PendingCreationUser,
  UserCreationStatus,
  UserCreationStatusDetails,
  UserInviteData,
} from "../../types/users";

type PendingCreationUserWithIndex = PendingCreationUser & { index: number };

export function getNewUsersWithIndex(
  pendingCreationUsers: PendingCreationUser[],
) {
  const usersWithIndex: PendingCreationUserWithIndex[] = pendingCreationUsers.map(
    (user, index) => ({ ...user, index }),
  );

  const newUsersWithIndex = usersWithIndex.filter(
    ({ status }) => status === UserCreationStatus.New,
  );

  return newUsersWithIndex;
}

export function getNewUserEmailToIndexMapping(
  newUsersWithIndex: PendingCreationUserWithIndex[],
) {
  const newUserEmailIndexMapping = new Map<string, number>();

  newUsersWithIndex.forEach(({ email, index }) =>
    newUserEmailIndexMapping.set(email, index),
  );

  return newUserEmailIndexMapping;
}

export function updateCreatedPendingCreationUsers(
  pendingCreationUsers: PendingCreationUser[],
  createdUserInvites: UserInviteData[],
  newUserEmailToIndexMapping: Map<string, number>,
) {
  createdUserInvites.forEach(({ email, role }) => {
    const userIndex = newUserEmailToIndexMapping.get(email) ?? -1;

    if (userIndex < 0) {
      return;
    }

    const { uuid } = pendingCreationUsers[userIndex];
    pendingCreationUsers[userIndex] = {
      uuid,
      email,
      role,
      status: UserCreationStatus.Created,
    };
  });
}

export function getAndUpdateInvalidNewUsers(
  pendingCreationUsers: PendingCreationUser[],
) {
  const invalidNewUsers: PendingCreationUser[] = [];

  pendingCreationUsers.forEach((user, index) => {
    if (user.status !== UserCreationStatus.New) {
      return;
    }

    const invalidNewUser: PendingCreationUser = {
      ...user,
      status: UserCreationStatus.Invalid,
    };

    pendingCreationUsers[index] = invalidNewUser;
    invalidNewUsers.push(invalidNewUser);
  });

  return invalidNewUsers;
}

export function userCreationTableRowRenderer(rowProps: TableRowProps) {
  const { className, rowData } = rowProps;
  const { status } = rowData as PendingCreationUser;
  const { classType } = {
    ...UserCreationStatusDetails.get(status),
  };

  return defaultTableRowRenderer({
    ...rowProps,
    className: classNames(className, classType),
  });
}
