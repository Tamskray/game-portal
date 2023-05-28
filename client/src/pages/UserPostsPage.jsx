import React, { useCallback, useEffect, useState } from "react";
import PostList from "../components/posts/PostList";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import { getPageCount, getPagesArray } from "../utils/pages";

import Button from "../components/UI/Button/Button";
import { useParams } from "react-router-dom";

const UserPostsPage = () => {
  const params = useParams();
  const storedData = JSON.parse(localStorage.getItem("sessionData"));
  const [loadedPosts, setLoadedPosts] = useState();
  const [loadedCreator, setLoadedCreator] = useState();
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
        `http://localhost:5000/api/posts/user/${params.userId}?limit=${limit}&page=${page}`
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData.message);
      }

      const totalCount = response.headers.get("X-Total-Count");
      //   console.log(response.headers.get("X-Total-Count"));
      setTotalPages(getPageCount(totalCount, limit));

      console.log(responseData);

      setLoadedPosts(responseData);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const fetchCreator = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${params.userId}`
      );
      const responseData = await response.json();
      setLoadedCreator(responseData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // fetchPosts(limit, page);
    localStorage.setItem("sessionData", JSON.stringify({ postPage: 0 }));
    setPage(0);
    fetchPosts(limit, 0);
    fetchCreator();
    // console.log("First uses post render");
  }, []);

  const changePageHandler = (page) => {
    setPage(page);
    console.log("Page " + page);
    fetchPosts(limit, page);

    localStorage.setItem("sessionData", JSON.stringify({ postPage: page }));
  };

  return (
    <>
      {loadedCreator && (
        <h1 className="posts__page__title">
          Пости користувача {loadedCreator.username}
        </h1>
      )}

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

export default UserPostsPage;
