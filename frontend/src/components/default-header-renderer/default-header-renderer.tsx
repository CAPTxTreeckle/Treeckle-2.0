import React from "react";
import { SortIndicator, SortDirectionType } from "react-virtualized";

type Props = {
  dataKey: string;
  disableSort?: boolean;
  label?: React.ReactNode;
  sortBy?: string;
  sortDirection?: SortDirectionType;
};

function DefaultHeaderRenderer({
  dataKey,
  disableSort,
  label,
  sortBy,
  sortDirection,
}: Props) {
  const showSortIndicator = !disableSort && sortBy === dataKey;

  const children = [
    <span
      className="ReactVirtualized__Table__headerTruncatedText"
      key="label"
      title={typeof label === "string" ? label : undefined}
    >
      {label}
    </span>,
  ];

  if (showSortIndicator) {
    children.push(
      <SortIndicator key="SortIndicator" sortDirection={sortDirection} />,
    );
  }

  return children;
}

export default DefaultHeaderRenderer;
