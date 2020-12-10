import React, { useCallback, useContext, useMemo } from "react";
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

  const onAttend = useCallback(
    () => updateSignUpsForEvent([{ action: SignUpActionType.Attend, userId }]),
    [updateSignUpsForEvent, userId],
  );

  const onApprove = useCallback(
    () => updateSignUpsForEvent([{ action: SignUpActionType.Confirm, userId }]),
    [updateSignUpsForEvent, userId],
  );

  const onReject = useCallback(
    () => updateSignUpsForEvent([{ action: SignUpActionType.Reject, userId }]),
    [updateSignUpsForEvent, userId],
  );

  const attendButton = useMemo(
    () => <Button key={0} content="Attend" color="teal" onClick={onAttend} />,
    [onAttend],
  );

  const approveButton = useMemo(
    () => (
      <Button key={1} content="Approve" color="green" onClick={onApprove} />
    ),
    [onApprove],
  );

  const rejectButton = useMemo(
    () => <Button key={2} content="Reject" color="red" onClick={onReject} />,
    [onReject],
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
