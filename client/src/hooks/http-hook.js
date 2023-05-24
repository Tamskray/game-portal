import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // store data across re-render cycles
  // use to abort request when we way out or switch away from the component that trigger the request
  const activeHttpRequest = useRef([]);

  // using useCallback cause if not to do it - hook can reruns, whenever
  // the component that uses to hook reruns
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      const httpAbortController = new AbortController();
      activeHttpRequest.current.push(httpAbortController);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortController.signal,
        });

        const responseData = await response.json();

        // clear the abort controllers that belong to request which just completed
        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqController) => reqController !== httpAbortController
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (e) {
        setError(e.message);
        setIsLoading(false);
        throw e;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // will executed as a cleanup funcrion before the next time useEffect runs again
    // or also when a components that uses useEffect unmounts
    return () => {
      activeHttpRequest.current.forEach((abortController) =>
        abortController.abort()
      );
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
