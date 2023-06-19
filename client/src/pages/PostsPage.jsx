import React, { useEffect, useState } from "react";
import { getPageCount, getPagesArray } from "../utils/pages";

import PostList from "../components/posts/PostList";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import Button from "../components/UI/button/Button";

import cl from "../styles/PostsPage.module.css";

import { useNavigate } from "react-router-dom";
import Pagination from "../components/UI/pagination/Pagination";
import PostItemSkeleton from "../components/posts/PostItemSkeleton";

const PostsPage = ({ rubric }) => {
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
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/${rubric}?limit=${limit}&page=${page}`
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData.message);
      }

      const totalCount = response.headers.get("X-Total-Count");
      setTotalPages(getPageCount(totalCount, limit));

      console.log(responseData);

      setLoadedPosts(responseData.posts);
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
  }, [rubric]);

  const changePageHandler = (page) => {
    setPage(page);
    console.log("Page " + page);
    fetchPosts(limit, page);

    localStorage.setItem("sessionData", JSON.stringify({ postPage: page }));
  };

  return (
    <>
      {isLoading && (
        <>
          <LoadingSpinner />
          <PostItemSkeleton itemsNumber={3} />
        </>
      )}

      {/* <PostItemSkeleton itemsNumber={1} /> */}

      {!isLoading && loadedPosts && (
        <>
          <h1 className="posts__page__title">
            &#9632; {loadedPosts && loadedPosts[0]?.rubric}
          </h1>
          <PostList items={loadedPosts} />{" "}
        </>
      )}
      {pagesArray && pagesArray.length > 1 && (
        <Pagination
          pagesArray={pagesArray}
          currentPage={page}
          changePage={changePageHandler}
        />
      )}
    </>
  );
};

export default PostsPage;
