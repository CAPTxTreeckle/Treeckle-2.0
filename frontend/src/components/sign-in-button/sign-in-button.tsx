import React, { useState } from "react";
import {
  Button,
  TransitionablePortal,
  Modal,
  Header,
  Grid,
} from "semantic-ui-react";
import { useOpenIdAuth, useGoogleAuth } from "../../custom-hooks/api";
import "./sign-in-button.scss";

function SignInButton() {
  const { startOpenIdAuth } = useOpenIdAuth();
  const { startGoogleAuth, isLoading: googleAuthLoading } = useGoogleAuth();
  const [isSignInOptionsOpened, setSignInOptionsOpened] = useState(false);

  return (
    <div className="sign-in-button-container">
      <Button
        fluid
        className="sign-in-button"
        content="Sign In"
        onClick={() => setSignInOptionsOpened(true)}
      />
      <TransitionablePortal
        open={isSignInOptionsOpened}
        transition={{ animation: "fade down" }}
      >
        <Modal
          open
          onClose={() => setSignInOptionsOpened(false)}
          size="tiny"
          closeIcon
        >
          <Modal.Header as={Header} textAlign="center">
            Sign In Options
          </Modal.Header>
          <Modal.Content>
            <Grid
              columns="2"
              textAlign="center"
              verticalAlign="middle"
              stretched
            >
              <Grid.Column>
                <Button
                  onClick={startOpenIdAuth}
                  content="Sign in with NUSNET"
                  color="blue"
                  fluid
                />
              </Grid.Column>
              <Grid.Column>
                <Button
                  onClick={startGoogleAuth}
                  content="Sign in with Google"
                  fluid
                  loading={googleAuthLoading}
                />
              </Grid.Column>
            </Grid>
          </Modal.Content>
        </Modal>
      </TransitionablePortal>
    </div>
  );
}

export default SignInButton;
