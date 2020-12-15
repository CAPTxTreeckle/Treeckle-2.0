import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Menu,
  Dropdown,
  DropdownProps,
  MenuItemProps,
} from "semantic-ui-react";
import { Media } from "../../context-providers";

type Props = {
  options: {
    key: number | string;
    name: string;
  }[];
  activeIndex?: number;
  onChange: (selectedIndex: number) => void;
};

function ResponsiveSelectorMenu({ options, activeIndex, onChange }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(activeIndex ?? 0);
  }, [activeIndex]);

  const _options = useMemo(
    () =>
      options.map(({ key, name }, index) => ({
        key,
        name,
        text: name,
        value: index,
      })),
    [options],
  );

  const _onChange = useCallback(
    (event: unknown, data: MenuItemProps | DropdownProps) => {
      const index = data.value ?? 0;
      onChange(index);
      setSelectedIndex(index);
    },
    [onChange],
  );

  return (
    <>
      <Media greaterThanOrEqual="tablet">
        <Menu
          onItemClick={_onChange}
          activeIndex={selectedIndex}
          items={_options}
          fluid
        />
      </Media>

      <Media lessThan="tablet">
        <Dropdown
          selection
          options={_options}
          onChange={_onChange}
          text={_options[selectedIndex].name}
          value={activeIndex}
        />
      </Media>
    </>
  );
}

export default ResponsiveSelectorMenu;
