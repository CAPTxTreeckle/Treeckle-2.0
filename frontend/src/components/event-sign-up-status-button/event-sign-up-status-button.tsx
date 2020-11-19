import React, { useCallback, useContext, useMemo } from "react";
import { Button, ButtonProps } from "semantic-ui-react";
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
    () => updateSignUpsForEvent([{ action: SignUpActionType.ATTEND, userId }]),
    [updateSignUpsForEvent, userId],
  );

  const onApprove = useCallback(
    () => updateSignUpsForEvent([{ action: SignUpActionType.CONFIRM, userId }]),
    [updateSignUpsForEvent, userId],
  );

  const onReject = useCallback(
    () => updateSignUpsForEvent([{ action: SignUpActionType.REJECT, userId }]),
    [updateSignUpsForEvent, userId],
  );

  const attendButtonProps: ButtonProps = useMemo(
    () => ({ key: 0, content: "Attend", color: "teal", onClick: onAttend }),
    [onAttend],
  );

  const approveButtonProps: ButtonProps = useMemo(
    () => ({ key: 0, content: "Approve", color: "green", onClick: onApprove }),
    [onApprove],
  );

  const rejectButtonProps: ButtonProps = useMemo(
    () => ({ key: 1, content: "Reject", color: "red", onClick: onReject }),
    [onReject],
  );

  const actions = useMemo(() => {
    switch (signUpStatus) {
      case SignUpStatus.PENDING:
        return [approveButtonProps, rejectButtonProps];
      case SignUpStatus.CONFIRMED:
        return [attendButtonProps, rejectButtonProps];
      default:
        return [rejectButtonProps];
    }
  }, [signUpStatus, rejectButtonProps, approveButtonProps, attendButtonProps]);

  const statusButton = useMemo(() => {
    switch (signUpStatus) {
      case SignUpStatus.PENDING:
        return <Button content="Pending" color="orange" loading={isLoading} />;
      case SignUpStatus.CONFIRMED:
        return <Button content="Attending" color="green" loading={isLoading} />;
      case SignUpStatus.ATTENDED:
        return <Button content="Attended" color="teal" loading={isLoading} />;
      default:
        return null;
    }
  }, [signUpStatus, isLoading]);

  return (
    <PopUpActionsWrapper vertical actions={actions}>
      {statusButton}
    </PopUpActionsWrapper>
  );
}

export default SignUpStatusButton;
