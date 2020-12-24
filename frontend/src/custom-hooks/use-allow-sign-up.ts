import { FormEvent, useCallback, useEffect, useState } from "react";
import { CheckboxProps } from "semantic-ui-react";
import { IS_SIGN_UP_APPROVAL_REQUIRED } from "../constants";

export default function useAllowSignUp(
  defaultIsSignUpAllowed: boolean,
  setValue: (key: string, value: boolean) => void,
) {
  const [isSignUpAllowed, setSignUpAllowed] = useState(defaultIsSignUpAllowed);

  useEffect(() => {
    setSignUpAllowed(defaultIsSignUpAllowed);
  }, [defaultIsSignUpAllowed]);

  const onAllowSignUp = useCallback(
    (e: FormEvent<HTMLInputElement>, { checked = false }: CheckboxProps) => {
      if (!checked) {
        setValue(IS_SIGN_UP_APPROVAL_REQUIRED, false);
      }
      setSignUpAllowed(checked);
    },
    [setValue],
  );

  return { isSignUpAllowed, onAllowSignUp };
}
