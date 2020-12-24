import React, { useContext, useMemo } from "react";
import { Button } from "semantic-ui-react";
import { SingleEventContext } from "../../context-providers";
import { SignUpActionType, SignUpStatus } from "../../types/events";
import PopUpActionsWrapper from "../pop-up-actions-wrapper";

type Props = {
  userId: number;
  signUpStatus: SignUpStatus;
};

function SignUpStatusButton({ userId, signUpStatus }: Props) {
  const { updateSignUpsForEvent, willUpdateUserIds } = useContext(
    SingleEventContext,
  );
  const isLoading = useMemo(() => willUpdateUserIds.has(userId), [
    willUpdateUserIds,
    userId,
  ]);

  const attendButton = useMemo(
    () => (
      <Button
        key="attend"
        content="Attend"
        color="teal"
        onClick={() =>
          updateSignUpsForEvent([{ action: SignUpActionType.Attend, userId }])
        }
      />
    ),
    [updateSignUpsForEvent, userId],
  );

  const approveButton = useMemo(
    () => (
      <Button
        key="approve"
        content="Approve"
        color="green"
        onClick={() =>
          updateSignUpsForEvent([{ action: SignUpActionType.Confirm, userId }])
        }
      />
    ),
    [updateSignUpsForEvent, userId],
  );

  const rejectButton = useMemo(
    () => (
      <Button
        key="reject"
        content="Reject"
        color="red"
        onClick={() =>
          updateSignUpsForEvent([{ action: SignUpActionType.Reject, userId }])
        }
      />
    ),
    [updateSignUpsForEvent, userId],
  );

  const actionButtons = useMemo(() => {
    switch (signUpStatus) {
      case SignUpStatus.Pending:
        return [approveButton, rejectButton];
      case SignUpStatus.Confirmed:
        return [attendButton, rejectButton];
      default:
        return [rejectButton];
    }
  }, [signUpStatus, rejectButton, approveButton, attendButton]);

  const statusButton = useMemo(() => {
    switch (signUpStatus) {
      case SignUpStatus.Pending:
        return <Button content="Pending" color="orange" loading={isLoading} />;
      case SignUpStatus.Confirmed:
        return <Button content="Attending" color="green" loading={isLoading} />;
      case SignUpStatus.Attended:
        return <Button content="Attended" color="teal" loading={isLoading} />;
      default:
        return null;
    }
  }, [signUpStatus, isLoading]);

  return (
    <PopUpActionsWrapper vertical actionButtons={actionButtons}>
      {statusButton}
    </PopUpActionsWrapper>
  );
}

export default SignUpStatusButton;
