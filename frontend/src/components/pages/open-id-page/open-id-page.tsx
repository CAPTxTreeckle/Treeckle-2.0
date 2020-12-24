import React, { useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "../../../custom-hooks";
import { UserContext } from "../../../context-providers";
import { HOME_PATH } from "../../../routes/paths";
import { useOpenIdAuth } from "../../../custom-hooks/api/auth-api";
import PlaceholderWrapper from "../../placeholder-wrapper";

function OpenIdPage() {
  const { updateUser } = useContext(UserContext);
  const { authenticate } = useOpenIdAuth();
  const history = useHistory();
  const query = useQuery();

  const handleFailure = useCallback(() => {
    const isCancelled = query.get("openid.mode") === "cancel";
    toast.error(isCancelled ? "Sign in cancelled." : "Invalid user.");
    history.push(HOME_PATH);
  }, [history, query]);

  useEffect(() => {
    const userId = query.get("openid.sreg.nickname");
    const email = query.get("openid.sreg.email");
    const name = query.get("openid.sreg.fullname");
    if (!userId || !email || !name) {
      handleFailure();
      return;
    }

    authenticate({ email, name, userId });
  }, [history, updateUser, handleFailure, authenticate, query]);

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
