import { useEffect, useState } from "react";

export function useDebounce(value, delay) {
  const [timer, setTimer] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setTimer(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return timer;
}
