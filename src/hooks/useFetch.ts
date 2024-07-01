import { useState, useEffect } from "react";
import axios from "axios";
import { Post } from "../types";

type Response = {
  posts: Post[];
  likesCount?: number;
  isLoading: boolean;
  error?: string;
};

const useFetch = (endpoint: string): Response => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    axios
      .get(endpoint, { baseURL: import.meta.env.VITE_API_URL })
      .then((res) => {
        setIsLoading(false);
        setPosts(res.data.posts);
        setLikesCount(res.data.likes);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }, []);

  return {
    posts,
    likesCount,
    isLoading,
    error,
  };
};

export default useFetch;
