import { useCallback, useContext, useMemo, useState } from "react";
import { Icon, Label, StrictLabelProps } from "semantic-ui-react";
import { EventSubscriptionsContext } from "../../context-providers";
import { SubscriptionActionType } from "../../types/events";

type Props = {
  category: string;
  color?: StrictLabelProps["color"];
  actionType: SubscriptionActionType;
};

function EventSubscriptionLabel({ category, color, actionType }: Props) {
  const { updateEventCategorySubscriptions } = useContext(
    EventSubscriptionsContext,
  );
  const [isLoading, setLoading] = useState(false);
  const icon = useMemo(() => {
    if (isLoading) {
      return <Icon name="spinner" loading />;
    }
    if (actionType === SubscriptionActionType.Subscribe) {
      return <Icon name="plus" />;
    }
    return <Icon name="cancel" />;
  }, [actionType, isLoading]);

  const onClick = useCallback(async () => {
    setLoading(true);
    await updateEventCategorySubscriptions([{ action: actionType, category }]);
    setLoading(false);
  }, [category, updateEventCategorySubscriptions, actionType]);

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
