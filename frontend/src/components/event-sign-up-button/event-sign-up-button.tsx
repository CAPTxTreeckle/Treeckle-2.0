import React, { useCallback, useContext, useMemo } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { SingleEventContext, UserContext } from "../../context-providers";
import { SignUpStatus } from "../../types/events";

function EventSignUpButton() {
  const {
    event,
    willUpdateUserIds,
    signUpForEvent,
    withdrawFromEvent,
  } = useContext(SingleEventContext);
  const { id: currentUserId } = useContext(UserContext);
  const isLoading = useMemo(
    () => (currentUserId ? willUpdateUserIds.has(currentUserId) : false),
    [currentUserId, willUpdateUserIds],
  );
  const { signUpCount, signUpStatus } = event ?? {};
  const { allowSignUp } = event?.eventFormProps ?? {};

  const onSignUpForEvent = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      signUpForEvent();
    },
    [signUpForEvent],
  );

  const onWithdrawFromEvent = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      withdrawFromEvent();
    },
    [withdrawFromEvent],
  );

  const renderButton = useCallback(() => {
    switch (signUpStatus) {
      case null:
        return (
          <Button
            as="div"
            labelPosition="right"
            onClick={onSignUpForEvent}
            className="full-width"
          >
            <Button color="red" fluid loading={isLoading}>
              <Icon name="user plus" /> Sign Up
            </Button>
            <Label basic color="red" pointing="left">
              {signUpCount}
            </Label>
          </Button>
        );

      case SignUpStatus.PENDING:
        return (
          <Button
            as="div"
            labelPosition="right"
            onClick={onWithdrawFromEvent}
            className="full-width"
          >
            <Button color="orange" fluid loading={isLoading}>
              <Icon name="user times" /> Withdraw (Pending)
            </Button>
            <Label basic color="orange" pointing="left">
              {signUpCount}
            </Label>
          </Button>
        );

      case SignUpStatus.CONFIRMED:
        return (
          <Button
            as="div"
            labelPosition="right"
            onClick={onWithdrawFromEvent}
            className="full-width"
          >
            <Button color="green" fluid loading={isLoading}>
              <Icon name="user times" /> Withdraw (Attending)
            </Button>
            <Label basic color="green" pointing="left">
              {signUpCount}
            </Label>
          </Button>
        );

      case SignUpStatus.ATTENDED:
        return (
          <Button
            as="div"
            labelPosition="right"
            className="full-width"
            disabled
          >
            <Button color="green" fluid loading={isLoading}>
              <Icon name="check" /> Attended
            </Button>
            <Label basic color="green" pointing="left">
              {signUpCount}
            </Label>
          </Button>
        );

      default:
        return null;
    }
  }, [
    signUpCount,
    signUpStatus,
    isLoading,
    onSignUpForEvent,
    onWithdrawFromEvent,
  ]);

  return allowSignUp || signUpStatus ? renderButton() : null;
}

export default EventSignUpButton;
