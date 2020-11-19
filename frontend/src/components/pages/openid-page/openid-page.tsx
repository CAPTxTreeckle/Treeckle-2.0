import React, { useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "../../../custom-hooks";
import { UserContext } from "../../../context-providers";
import { HOME_PATH } from "../../../routes";
import { useOpenIdAuth } from "../../../custom-hooks/api";
import PlaceholderWrapper from "../../placeholder-wrapper";

function OpenIdPage() {
  const { setUser } = useContext(UserContext);
  const { authenticate } = useOpenIdAuth();
  const history = useHistory();
  const query = useQuery();

  const handleFailure = useCallback(() => {
    const isCancelled = query.get("openid.mode") === "cancel";
    toast.error(isCancelled ? "Sign in cancelled." : "Invalid user.");
    history.push(HOME_PATH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  useEffect(() => {
    const nusnetId = query.get("openid.sreg.nickname");
    const email = query.get("openid.sreg.email");
    const name = query.get("openid.sreg.fullname");
    if (!nusnetId || !email || !name) {
      handleFailure();
      return;
    }
    const emailSections = email.split("@");
    emailSections[0] = nusnetId;
    const nusnetEmail = emailSections.join("@");
    authenticate({ email: nusnetEmail, name, nusnetId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, setUser, handleFailure, authenticate]);

  return (
    <PlaceholderWrapper
      isLoading
      loadingMessage="Signing in"
      inverted
      placeholder
    />
  );
}

export default OpenIdPage;
