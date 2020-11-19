import React from "react";
import { Button, Icon, Modal } from "semantic-ui-react";
import { useInviteUsers } from "../../custom-hooks/api/users-api";
import useUserInviteForm from "../user-invite-form";
import "./user-invite.scss";

interface Props {
  className: string;
}

function UserInvite({ className }: Props) {
  const [isInvitationModalOpen, setIsInvitationModalOpen] = React.useState(
    false,
  );
  const { inviteUsers } = useInviteUsers();
  const {
    emails,
    resetEmails,
    resetErrors,
    errors,
    UserInviteForm,
  } = useUserInviteForm();

  function closeModal() {
    resetEmails();
    resetErrors();
    setIsInvitationModalOpen(false);
  }

  return (
    <>
      <Button
        color="green"
        className={className}
        onClick={() => setIsInvitationModalOpen(true)}
      >
        Invite
      </Button>
      <Modal
        size="tiny"
        open={isInvitationModalOpen}
        onOpen={() => setIsInvitationModalOpen(true)}
        onClose={closeModal}
        closeOnDimmerClick
        closeOnEscape
        className="invitation-modal"
      >
        <Modal.Header>Invite Users to Your Organization</Modal.Header>
        <Modal.Content>
          <UserInviteForm />
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              if (!errors) {
                setIsInvitationModalOpen(false);
                inviteUsers(emails);
                resetEmails();
                resetErrors();
              }
            }}
          >
            <Icon name="checkmark" /> Submit
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default UserInvite;
