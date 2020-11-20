import React from "react";
import { Button, Modal, Icon, Input } from "semantic-ui-react";
import {
  Column,
  Table,
  AutoSizer,
  WindowScroller,
  TableCellProps,
  SortDirection,
  SortDirectionType,
} from "react-virtualized";
import * as JsSearch from "js-search";
import throttle from "lodash.throttle";

import {
  useGetUsersFromSameOrganisation,
  useDeleteUser,
  usePatchUserRole,
} from "../../custom-hooks/api/users-api";
import { UserData } from "../../types/users";
import UserTableActionButtons from "../user-table-action-buttons";
import { toTitleCase } from "../../utils/helpers";
import { generateSearchUtil } from "../../utils/search";
import "./user-table.scss";
import "react-virtualized/styles.css";
import PlaceholderWrapper from "../placeholder-wrapper";

interface SelectedUserData {
  email: string;
  id: number;
}

const searchIndex = "id";
const columns = ["name", "email", "role"];

function searchAndSetDisplayedUsers(
  userSearchUtil: JsSearch.Search,
  searchTerm: string,
  setDisplayedUsers: React.Dispatch<React.SetStateAction<UserData[]>>,
) {
  const searchResults = userSearchUtil.search(searchTerm) as UserData[];
  setDisplayedUsers(searchResults);
}

const throttleTime = 200;
const throttledSearchAndSetDisplayedUsers = throttle(
  searchAndSetDisplayedUsers,
  throttleTime,
);

function UserTable() {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = React.useState(
    false,
  );
  const [selectedUser, setSelectedUser] = React.useState<SelectedUserData>({
    id: 0,
    email: "",
  });
  const tableRef = React.useRef();
  const [currentSortDirection, setCurrentSortDirection] = React.useState<
    SortDirectionType
  >(SortDirection.ASC);
  const [currentSortDataKey, setCurrentSortDataKey] = React.useState("");
  const [
    userSearchUtil,
    setUserSearchUtil,
  ] = React.useState<JsSearch.Search | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [displayedUsers, setDisplayedUsers] = React.useState<UserData[]>([]);

  function actionCellRenderer({ rowData }: TableCellProps) {
    return (
      <UserTableActionButtons
        rowData={rowData}
        patchUserRole={patchUserRole}
        onClickDeleteUserButton={() => {
          setIsConfirmationModalOpen(true);
          setSelectedUser({ id: rowData.id, email: rowData.email });
        }}
      />
    );
  }

  const { users, isLoading, getUsers } = useGetUsersFromSameOrganisation();
  const { isLoading: isDeletingUser, deleteUser } = useDeleteUser();
  const {
    isLoading: isPatchingUserRole,
    patchUserRole: patchUser,
  } = usePatchUserRole();

  React.useEffect(() => {
    (async () => {
      await getUsers();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (users.length === 0) {
      return;
    }
    const search = generateSearchUtil(searchIndex, columns, users);
    setUserSearchUtil(search);
    setDisplayedUsers(users);
  }, [users]);

  React.useEffect(() => {
    if (!userSearchUtil) {
      return;
    }
    if (!searchTerm) {
      // must be set after throttle time to allow any throttled function to be executed before this is executed
      setTimeout(() => setDisplayedUsers(users), throttleTime);
      return;
    }
    throttledSearchAndSetDisplayedUsers(
      userSearchUtil,
      searchTerm,
      setDisplayedUsers,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchTerm, userSearchUtil]);

  async function deleteSelectedUser(email: string) {
    await deleteUser(email);
    getUsers();
  }

  async function patchUserRole(id: number, role: string) {
    await patchUser(id, role);
    getUsers();
  }

  function sort({ sortBy }: { sortBy: string }) {
    const criteria = sortBy as keyof UserData;
    displayedUsers.sort((a, b) => {
      const aValue = (a[criteria] as string).toLowerCase();
      const bValue = (b[criteria] as string).toLowerCase();
      if (currentSortDirection === SortDirection.ASC) {
        // eslint-disable-next-line no-nested-ternary
        return aValue > bValue ? 1 : bValue > aValue ? -1 : 0;
      }
      // eslint-disable-next-line no-nested-ternary
      return bValue > aValue ? 1 : aValue > bValue ? -1 : 0;
    });
    setCurrentSortDirection(
      currentSortDirection === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC,
    );
    setCurrentSortDataKey(criteria);
    if (tableRef.current) {
      // @ts-ignore
      tableRef.current.forceUpdateGrid();
    }
  }

  return (
    <PlaceholderWrapper
      isLoading={isLoading || isDeletingUser || isPatchingUserRole}
      loadingMessage="Retrieving all users..."
      inverted
      showDefaultMessage={users.length === 0}
      defaultMessage="There are no users in your organization."
    >
      <Input
        fluid
        icon="search"
        iconPosition="left"
        placeholder="Search..."
        className="user-table-search-input"
        onChange={(_event, data) => setSearchTerm(data.value)}
      />
      <Modal
        size="mini"
        open={isConfirmationModalOpen}
        onOpen={() => setIsConfirmationModalOpen(true)}
        onClose={() => setIsConfirmationModalOpen(false)}
        closeOnDimmerClick
        closeOnEscape
        dimmer="blurring"
        className="confirmation-modal"
      >
        <Modal.Content>
          The user with email <strong>{selectedUser.email}</strong> will be
          deleted.
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setIsConfirmationModalOpen(false)}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              deleteSelectedUser(selectedUser.email);
              setIsConfirmationModalOpen(false);
            }}
          >
            <Icon name="checkmark" /> Confirm
          </Button>
        </Modal.Actions>
      </Modal>

      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer>
            {({ width }) => (
              <Table
                // @ts-ignore
                ref={tableRef}
                width={width}
                autoHeight
                height={height}
                headerHeight={45}
                rowHeight={55}
                rowCount={displayedUsers ? displayedUsers.length : 0}
                rowGetter={({ index }) =>
                  displayedUsers &&
                  displayedUsers[index % displayedUsers.length]
                }
                rowClassName="user-table-row"
                rowStyle={({ index }) => {
                  return {
                    backgroundColor:
                      // eslint-disable-next-line no-nested-ternary
                      index === -1
                        ? "#788296"
                        : index % 2 !== 0
                        ? "white"
                        : "#f9fafb",
                    borderTopLeftRadius: index === -1 ? "0.3rem" : "0",
                    borderTopRightRadius: index === -1 ? "0.3rem" : "0",
                  };
                }}
                sort={sort}
                sortBy={currentSortDataKey}
                sortDirection={currentSortDirection}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                gridClassName="user-table-grid"
                headerClassName="user-table-header"
                style={{
                  width,
                }}
              >
                <Column
                  label="Name"
                  dataKey="name"
                  width={width * 0.2}
                  className="user-table-columns"
                  disableSort={false}
                />
                <Column label="Email" dataKey="email" width={width * 0.425} />
                <Column
                  label="Role"
                  dataKey="role"
                  width={width * 0.15}
                  cellRenderer={({ rowData }: TableCellProps) =>
                    toTitleCase(rowData.role)
                  }
                />
                <Column
                  label="Actions"
                  dataKey="id"
                  cellRenderer={actionCellRenderer}
                  headerClassName="user-table-action-column-header"
                  width={width * 0.225}
                  disableSort
                />
              </Table>
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </PlaceholderWrapper>
  );
}

export default UserTable;
