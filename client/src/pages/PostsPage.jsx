import React, { useCallback, useEffect, useState } from "react";
import PostList from "../components/posts/PostList";

import { useHttpClient } from "../hooks/http-hook";

const PostsPage = () => {
  const [loadedPosts, setLoadedPosts] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/posts"
        );

        console.log(responseData);

        setLoadedPosts(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, [sendRequest]);

  return <div>{loadedPosts && <PostList items={loadedPosts} />}</div>;
};

export default PostsPage;
