import { useEffect, useState } from "react";

export default function useStateWithCallback<T>(
  initialState: T,
): [T, (value: T, callback?: (value: T) => void) => void] {
  const [state, setState] = useState<{
    value: T;
    callback?: (value: T) => void;
  }>({ value: initialState });

  useEffect(() => {
    const { callback, value } = state;
    callback?.(value);
  }, [state]);

  return [
    state.value,
    (value: T, callback?: (value: T) => void) => setState({ value, callback }),
  ];
}
