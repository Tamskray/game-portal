import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";

const useRequest = <T>(
  config: AxiosRequestConfig<any>
): [T | undefined, boolean, string, () => void] => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    sendRequest();
  }, []);

  const request = () => {
    sendRequest();
  };

  const sendRequest = () => {
    setIsLoading(true);

    axios(config)
      .then((res) => {
        setError("");
        setData(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  return [data, isLoading, error, request];
};

export default useRequest;
