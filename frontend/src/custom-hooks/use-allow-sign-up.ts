import { useCallback, useEffect, useState } from "react";
import { CheckboxProps } from "semantic-ui-react";
import { SIGN_UP_REQUIRE_APPROVAL } from "../constants";

export default function useAllowSignUp(
  defaultAllowSignUp: boolean,
  setValue: (key: string, value: boolean) => void,
) {
  const [allowSignUp, setAllowSignUp] = useState(defaultAllowSignUp);

  useEffect(() => {
    setAllowSignUp(defaultAllowSignUp);
  }, [defaultAllowSignUp]);

  const onAllowSignUp = useCallback(
    (
      e: React.FormEvent<HTMLInputElement>,
      { checked = false }: CheckboxProps,
    ) => {
      if (!checked) {
        setValue(SIGN_UP_REQUIRE_APPROVAL, false);
      }
      setAllowSignUp(checked);
    },
    [setValue],
  );

  return { allowSignUp, onAllowSignUp };
}
