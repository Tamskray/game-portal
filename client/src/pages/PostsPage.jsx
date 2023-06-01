import React, { useEffect, useState } from "react";
import { getPageCount, getPagesArray } from "../utils/pages";

import PostList from "../components/posts/PostList";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import Button from "../components/UI/Button/Button";

import cl from "../styles/PostsPage.module.css";
import { useNavigate } from "react-router-dom";

const PostsPage = ({ news, articles, reviews }) => {
  // localStorage.clear();
  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem("sessionData"));
  const [loadedPosts, setLoadedPosts] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(storedData ? storedData.postPage : 0);
  const [totalPages, setTotalPages] = useState("");
  const pagesArray = getPagesArray(totalPages);

  const fetchPosts = async (limit = 0, page = 0) => {
    try {
      // const responseData = await sendRequest(
      //   "http://localhost:5000/api/posts"
      // );
      setIsLoading(true);
      let response;
      if (news) {
        response = await fetch(
          `http://localhost:5000/api/posts/news?limit=${limit}&page=${page}`
        );
      } else if (articles) {
        response = await fetch(
          `http://localhost:5000/api/posts/articles?limit=${limit}&page=${page}`
        );
      } else if (reviews) {
        response = await fetch(
          `http://localhost:5000/api/posts/reviews?limit=${limit}&page=${page}`
        );
      }

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
  }, [news, articles, reviews]);

  const changePageHandler = (page) => {
    setPage(page);
    console.log("Page " + page);
    fetchPosts(limit, page);

    localStorage.setItem("sessionData", JSON.stringify({ postPage: page }));
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}

      {!isLoading && loadedPosts && (
        <>
          <h1 className="posts__page__title">
            &#9632; {loadedPosts && loadedPosts[0].rubric}
          </h1>
          <PostList items={loadedPosts} />{" "}
        </>
      )}
      {pagesArray && pagesArray.length > 1 && (
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
