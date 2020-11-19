import React, { useCallback } from "react";
import { Icon } from "semantic-ui-react";
import {
  Column,
  Table,
  AutoSizer,
  WindowScroller,
  TableCellProps,
  defaultTableRowRenderer,
  TableRowProps,
  SortDirectionType,
  SortDirection,
  TableCellRenderer,
} from "react-virtualized";
import { toast } from "react-toastify";

import "./bookings-requests-table.scss";
import "react-virtualized/styles.css";
import { usePatchBookingStatus } from "../../custom-hooks/api/bookings-api";
import BookingRequestStatusLabel from "../booking-requests-status-label";
import BookingRequestsFormData from "../booking-requests-table-form-data";
import { Media } from "../../context-providers/responsive-provider";
import { BookingRequestData } from "../../types/bookings";
import { displayDatetime } from "../../utils/parser";
import BookingRequestCommentModal from "../booking-request-comments-modal";
import PlaceholderWrapper from "../placeholder-wrapper";

function dateCellRenderer({ rowData, dataKey }: TableCellProps) {
  const datetime = new Date(rowData[dataKey]);
  return displayDatetime(datetime, "D/M/YY h.mma");
}

interface Props {
  bookingRequests: BookingRequestData[];
  isLoadingRequests: boolean;
  getBookingRequests: () => Promise<void>;
  isAdminTable: boolean;
}

function BookingRequestsTable({
  bookingRequests,
  isLoadingRequests,
  getBookingRequests,
  isAdminTable,
}: Props) {
  const tableRef = React.useRef();
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const [currentSortDirection, setCurrentSortDirection] = React.useState<
    SortDirectionType
  >(SortDirection.ASC);
  const [currentSortDataKey, setCurrentSortDataKey] = React.useState("");

  const {
    isLoading: isPatchingBookingStatus,
    patchBookingStatus,
  } = usePatchBookingStatus();

  async function updateBookingStatus(id: number, status: number) {
    await patchBookingStatus(id, status);
    await getBookingRequests();
  }

  function openExpandableRow(index: number) {
    setSelectedIndex(index);
  }

  function statusCellRenderer({ rowData }: TableCellProps) {
    return (
      <BookingRequestStatusLabel
        id={rowData.id}
        status={rowData.status}
        patchBookingStatus={updateBookingStatus}
        isAdminTable={isAdminTable}
      />
    );
  }

  function actionCellRenderer({
    rowIndex,
    rowData,
    columnData,
  }: TableCellProps) {
    const isSelected = rowIndex === selectedIndex;
    const index = !isSelected ? rowIndex : -1;

    const isMobile = columnData?.isMobile;

    return (
      <div className="booking-requests-table-action-cell">
        <BookingRequestCommentModal
          bookingRequestId={rowData.id}
          iconClassName={isMobile ? "" : "booking-request-comments-icon"}
        />
        {!isMobile && (
          <Icon
            // @ts-ignore
            name={`caret square outline ${!isSelected ? "down" : "up"}`}
            color="teal"
            onClick={() => openExpandableRow(index)}
          />
        )}
      </div>
    );
  }

  const rowRenderer = (props: TableRowProps) => {
    const { index, style, className, key, rowData } = props;
    let formData;
    try {
      formData = JSON.parse(rowData.formData);
    } catch (error) {
      toast.error("An error has occurred while fetching this booking request.");
      formData = {};
    }

    return (
      <div
        style={{
          ...style,
          display: "flex",
          flexDirection: "column",
        }}
        className={className}
        key={key}
      >
        {defaultTableRowRenderer({
          ...props,
          style: { width: style.width, height: 55 },
          onRowClick: () => {
            openExpandableRow(index === selectedIndex ? -1 : index);
          },
        })}
        {index === selectedIndex && (
          <div className="booking-requests-table-expandable-row">
            <BookingRequestsFormData
              formData={formData}
              className="booking-requests-table-form-data-grid"
            />
          </div>
        )}
      </div>
    );
  };

  function sort({ sortBy }: { sortBy: string }) {
    const criteria = sortBy as keyof BookingRequestData;
    bookingRequests.sort((a, b) => {
      const aValue = a[criteria];
      const bValue = b[criteria];
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

  const generateColumn = useCallback(
    (
      label: string,
      dataKey: string,
      width: number,
      widthMultipler: number,
      disableSort: boolean,
      cellRenderer?: TableCellRenderer | undefined,
      columnData?: Record<string, unknown>,
    ) => (
      <Column
        label={label}
        dataKey={dataKey}
        width={width * widthMultipler}
        className="booking-requests-table-columns"
        disableSort={disableSort}
        cellRenderer={cellRenderer}
        columnData={columnData}
      />
    ),
    [],
  );

  function ResponsiveBookingsTable({ isMobile }: { isMobile: boolean }) {
    return (
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop, registerChild }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <div ref={registerChild}>
                <Table
                  // @ts-ignore
                  ref={tableRef}
                  width={width}
                  autoHeight
                  height={height}
                  headerHeight={42}
                  rowHeight={({ index }) =>
                    index === selectedIndex ? 255 : 55
                  }
                  rowCount={bookingRequests ? bookingRequests.length : 0}
                  rowGetter={({ index }) =>
                    bookingRequests &&
                    bookingRequests[index % bookingRequests.length]
                  }
                  rowClassName="booking-requests-table-row"
                  rowStyle={({ index }) => {
                    return {
                      backgroundColor:
                        // eslint-disable-next-line no-nested-ternary
                        index === -1
                          ? "#788296"
                          : index % 2 !== 0
                          ? "white"
                          : "#f9fafb",
                      borderTopLeftRadius: index === -1 ? "0.4rem" : "0",
                      borderTopRightRadius: index === -1 ? "0.4rem" : "0",
                    };
                  }}
                  rowRenderer={rowRenderer}
                  sort={sort}
                  sortBy={currentSortDataKey}
                  sortDirection={currentSortDirection}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  scrollToIndex={selectedIndex}
                  gridClassName="booking-requests-table-grid"
                  headerClassName="booking-requests-table-header"
                  style={{
                    width,
                    marginBottom: "50px",
                  }}
                >
                  {generateColumn(
                    "Name",
                    "name",
                    width,
                    isMobile ? 0.11 : 0.125,
                    false,
                  )}
                  {generateColumn(
                    "Venue",
                    "venue",
                    width,
                    isMobile ? 0.14 : 0.15,
                    false,
                  )}
                  {generateColumn(
                    "Start",
                    "startDate",
                    width,
                    isMobile ? 0.16 : 0.17,
                    false,
                    dateCellRenderer,
                  )}
                  {generateColumn(
                    "End",
                    "endDate",
                    width,
                    isMobile ? 0.16 : 0.17,
                    false,
                    dateCellRenderer,
                  )}
                  {generateColumn(
                    "Submitted",
                    "createdAt",
                    width,
                    isMobile ? 0.16 : 0.17,
                    false,
                    dateCellRenderer,
                  )}
                  {generateColumn(
                    "Status",
                    "status",
                    width,
                    isMobile ? 0.22 : 0.165,
                    false,
                    statusCellRenderer,
                  )}
                  {generateColumn(
                    "",
                    "id",
                    width,
                    0.05,
                    false,
                    actionCellRenderer,
                    {
                      isMobile,
                    },
                  )}
                </Table>
              </div>
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    );
  }

  return (
    <PlaceholderWrapper
      isLoading={isLoadingRequests || isPatchingBookingStatus}
      loadingMessage="Retrieving booking requests..."
      showDefaultMessage={bookingRequests.length === 0}
      defaultMessage="There are no booking requests made."
      inverted
    >
      <Media greaterThanOrEqual="tablet">
        <ResponsiveBookingsTable isMobile={false} />
      </Media>
      <Media lessThan="tablet">
        <ResponsiveBookingsTable isMobile />
      </Media>
    </PlaceholderWrapper>
  );
}

export default BookingRequestsTable;
