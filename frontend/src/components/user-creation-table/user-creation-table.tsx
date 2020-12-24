import { useCallback, useContext, useMemo, useState } from "react";
import { Table, Column, AutoSizer } from "react-virtualized";
import { Button, List, ModalContent, Segment } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useVirtualizedTableState } from "../../custom-hooks";
import PlaceholderWrapper from "../placeholder-wrapper";
import {
  UserCreationContext,
  DeleteModalProvider,
  GlobalModalContext,
} from "../../context-providers";
import DeleteButton from "../delete-button";
import SearchBar from "../search-bar";
import { VirtualizedTableStateOptions } from "../../custom-hooks/use-virtualized-table-state";
import DeleteModalButton from "../delete-modal-button";
import UserCreationTableDescriptionSection from "../user-creation-table-description-section";

import { PendingCreationUser, UserCreationStatus } from "../../types/users";
import {
  getNewUsersWithIndex,
  getNewUserEmailToIndexMapping,
  getAndUpdateInvalidNewUsers,
  updateCreatedPendingCreationUsers,
  userCreationTableRowRenderer,
} from "./helpers";
import { useCreateUserInvites } from "../../custom-hooks/api";
import { EMAIL, ROLE, STATUS, UUID } from "../../constants";
import { resolveApiError } from "../../utils/error-utils";

const userCreationTableStateOptions: VirtualizedTableStateOptions = {
  searchIndex: UUID,
  searchKeys: [EMAIL, ROLE, STATUS],
};

function UserCreationTable() {
  const { pendingCreationUsers, setPendingCreationUsers } = useContext(
    UserCreationContext,
  );
  const { setModalOpen, setModalProps } = useContext(GlobalModalContext);
  const { createUserInvites } = useCreateUserInvites();
  const newPendingCreationUsers = useMemo(
    () =>
      pendingCreationUsers.filter(
        ({ status }) => status === UserCreationStatus.New,
      ),
    [pendingCreationUsers],
  );

  const {
    processedData: processedPendingCreationUsers,
    searchValue,
    onSearchValueChange,
  } = useVirtualizedTableState(
    pendingCreationUsers,
    userCreationTableStateOptions,
  );

  const [isSubmitting, setSubmitting] = useState(false);

  const onDeleteRow = useCallback(
    ({ uuid: currentUuid, email: currentEmail }: PendingCreationUser) => {
      const updatedPendingCreationUsers = pendingCreationUsers.filter(
        ({ uuid }) => currentUuid !== uuid,
      );

      // change a duplicate entry (if exists) to New status
      [...updatedPendingCreationUsers].reverse().some((user) => {
        if (user.email === currentEmail) {
          if (user.status === UserCreationStatus.Duplicate) {
            user.status = UserCreationStatus.New;
          }
          // will break the array iteration
          return true;
        }
        // array iteration continues
        return false;
      });

      setPendingCreationUsers(updatedPendingCreationUsers);
    },
    [pendingCreationUsers, setPendingCreationUsers],
  );

  const onClearAllRows = useCallback(() => {
    setPendingCreationUsers([]);
    return true;
  }, [setPendingCreationUsers]);

  const onCreateUsers = useCallback(async () => {
    const pendingCreationUsersCopy = [...pendingCreationUsers];
    try {
      setSubmitting(true);

      const newUsersWithIndex = getNewUsersWithIndex(pendingCreationUsersCopy);
      const newUserEmailToIndexMapping = getNewUserEmailToIndexMapping(
        newUsersWithIndex,
      );
      const newUsersToBeCreated = newUsersWithIndex.map(({ email, role }) => ({
        email,
        role,
      }));

      const createdUserInvites = await createUserInvites(newUsersToBeCreated);

      updateCreatedPendingCreationUsers(
        pendingCreationUsersCopy,
        createdUserInvites,
        newUserEmailToIndexMapping,
      );

      toast.success("New user(s) created successfully.");
    } catch (error) {
      resolveApiError(error);
    } finally {
      const invalidNewUsers = getAndUpdateInvalidNewUsers(
        pendingCreationUsersCopy,
      );

      setPendingCreationUsers(pendingCreationUsersCopy);
      setSubmitting(false);

      if (invalidNewUsers.length > 0) {
        setModalProps({
          header: "Invalid New Users",
          content: (
            <ModalContent>
              <h3>The following users were not created successfully:</h3>
              <List ordered>
                {invalidNewUsers.map(({ email }, index) => (
                  <List.Item key={`${email}${index}`}>{email}</List.Item>
                ))}
              </List>
            </ModalContent>
          ),
        });
        setModalOpen(true);
      }
    }
  }, [
    createUserInvites,
    pendingCreationUsers,
    setPendingCreationUsers,
    setModalOpen,
    setModalProps,
  ]);

  return (
    <>
      <UserCreationTableDescriptionSection />

      <Segment.Group raised>
        <Segment secondary>
          <SearchBar
            searchValue={searchValue}
            onSearchValueChange={onSearchValueChange}
            fluid
          />
        </Segment>
        <Segment className="virtualized-table-wrapper">
          <AutoSizer>
            {({ width, height }) => (
              <Table
                height={height}
                width={width}
                headerHeight={height * 0.1}
                rowGetter={({ index }) => processedPendingCreationUsers[index]}
                rowHeight={height * 0.1}
                rowCount={processedPendingCreationUsers.length}
                overscanRowCount={20}
                noRowsRenderer={() => (
                  <PlaceholderWrapper
                    showDefaultMessage
                    defaultMessage="No pending creation users"
                    placeholder
                  />
                )}
                rowRenderer={userCreationTableRowRenderer}
              >
                <Column dataKey={EMAIL} label="Email" width={width * 0.45} />
                <Column
                  dataKey={ROLE}
                  label="Role"
                  width={width * 0.2}
                  cellRenderer={({ cellData }) =>
                    cellData?.toLowerCase() ?? cellData
                  }
                  className="capitalize-text"
                />
                <Column
                  dataKey={STATUS}
                  label="Status"
                  width={width * 0.2}
                  cellRenderer={({ cellData }) =>
                    cellData?.toLowerCase() ?? cellData
                  }
                  className="capitalize-text"
                />
                <Column
                  dataKey={UUID}
                  label="Action"
                  headerClassName="center-text"
                  className="center-text"
                  width={width * 0.15}
                  cellRenderer={({ rowData }) => (
                    <DeleteButton
                      compact
                      onDelete={() => onDeleteRow(rowData)}
                    />
                  )}
                />
              </Table>
            )}
          </AutoSizer>
        </Segment>

        <Segment secondary>
          <div className="action-container justify-end">
            <DeleteModalProvider
              onDelete={onClearAllRows}
              deleteTitle="Clear All Pending Creation Users"
              deleteDescription="Are you sure you want to clear all pending creation users?"
            >
              <DeleteModalButton
                label="Clear All"
                popUpContent={null}
                icon={null}
                disabled={pendingCreationUsers.length === 0}
              />
            </DeleteModalProvider>

            <Button
              content="Create Users"
              color="blue"
              onClick={onCreateUsers}
              loading={isSubmitting}
              disabled={newPendingCreationUsers.length === 0}
            />
          </div>
        </Segment>
      </Segment.Group>
    </>
  );
}

export default UserCreationTable;
