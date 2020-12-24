import { Input, Icon } from "semantic-ui-react";

type Props = {
  className?: string;
  searchValue: string;
  onSearchValueChange: (newValue: string) => void;
  fluid?: boolean;
};

function SearchBar({
  className,
  searchValue,
  onSearchValueChange,
  fluid = false,
}: Props) {
  return (
    <Input
      className={className}
      icon={
        searchValue ? (
          <Icon name="times" link onClick={() => onSearchValueChange("")} />
        ) : (
          <Icon name="search" />
        )
      }
      iconPosition="left"
      value={searchValue}
      onChange={(event, { value }) => onSearchValueChange(value)}
      fluid={fluid}
      placeholder="Search..."
    />
  );
}

export default SearchBar;
