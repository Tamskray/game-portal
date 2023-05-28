import React, { useEffect, useState } from "react";
import { getPageCount, getPagesArray } from "../utils/pages";

import PostList from "../components/posts/PostList";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import Button from "../components/UI/Button/Button";

const PostsPage = () => {
  // localStorage.clear();
  const storedData = JSON.parse(localStorage.getItem("sessionData"));
  const [loadedPosts, setLoadedPosts] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(2);
  const [page, setPage] = useState(storedData ? storedData.postPage : 0);
  const [totalPages, setTotalPages] = useState("");
  const pagesArray = getPagesArray(totalPages);

  const fetchPosts = async (limit = 0, page = 0) => {
    try {
      // const responseData = await sendRequest(
      //   "http://localhost:5000/api/posts"
      // );
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/posts?limit=${limit}&page=${page}`
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData.message);
      }

      const totalCount = response.headers.get("X-Total-Count");
      setTotalPages(getPageCount(totalCount, limit));

      console.log(responseData);

      setLoadedPosts(responseData);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetchPosts(limit, page);
    console.clear();
    fetchPosts(limit, page);
  }, []);

  const changePageHandler = (page) => {
    setPage(page);
    console.log("Page " + page);
    fetchPosts(limit, page);

    localStorage.setItem("sessionData", JSON.stringify({ postPage: page }));
  };

  return (
    <>
      <h1 className="posts__page__title">Усі пости</h1>

      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedPosts && <PostList items={loadedPosts} />}
      {pagesArray && (
        <div>
          {pagesArray.map((p) =>
            page === p ? (
              <Button
                key={p}
                label={p + 1}
                inverse
                onClick={() => changePageHandler(p)}
              />
            ) : (
              <Button
                key={p}
                label={p + 1}
                onClick={() => changePageHandler(p)}
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default PostsPage;
