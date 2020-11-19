import React, { useCallback, useContext, useMemo, useState } from "react";
import { Icon, Label, StrictLabelProps } from "semantic-ui-react";
import { EventSubscriptionsContext } from "../../context-providers";
import { SubscribeActionType } from "../../types/events";

type Props = {
  category: string;
  color?: StrictLabelProps["color"];
  actionType: SubscribeActionType;
};

function EventSubscriptionLabel({ category, color, actionType }: Props) {
  const { updateSubscriptions } = useContext(EventSubscriptionsContext);
  const [isLoading, setLoading] = useState(false);
  const icon = useMemo(() => {
    if (isLoading) {
      return <Icon name="spinner" loading />;
    }
    if (actionType === SubscribeActionType.SUBSCRIBE) {
      return <Icon name="plus" />;
    }
    return <Icon name="cancel" />;
  }, [actionType, isLoading]);

  const onClick = useCallback(async () => {
    setLoading(true);
    await updateSubscriptions([{ action: actionType, categoryName: category }]);
    setLoading(false);
  }, [category, updateSubscriptions, actionType]);

  return (
    <Label
      as="a"
      color={color}
      content={category}
      icon={icon}
      onClick={onClick}
    />
  );
}

export default EventSubscriptionLabel;
