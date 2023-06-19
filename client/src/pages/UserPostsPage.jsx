import React, { useCallback, useEffect, useState } from "react";
import PostList from "../components/posts/PostList";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import { getPageCount, getPagesArray } from "../utils/pages";

import Button from "../components/UI/button/Button";
import { useParams } from "react-router-dom";
import Pagination from "../components/UI/pagination/Pagination";
import Avatar from "../components/UI/avatar/Avatar";

import cl from "../styles/UserPostsPage.module.css";
import PostItemSkeleton from "../components/posts/PostItemSkeleton";

import { TbArticle } from "react-icons/tb";
import { VscHeartFilled } from "react-icons/vsc";

const UserPostsPage = () => {
  const params = useParams();
  const storedData = JSON.parse(localStorage.getItem("sessionData"));
  const [loadedPosts, setLoadedPosts] = useState();
  const [loadedCreator, setLoadedCreator] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(storedData ? storedData.postPage : 0);
  const [totalPages, setTotalPages] = useState("");
  const [totalPostsCount, setTotalPostsCount] = useState();
  const pagesArray = getPagesArray(totalPages);
  const [postsLikesCount, setPostsLikesCount] = useState();

  const fetchPosts = async (limit = 0, page = 0) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/posts/user/${params.userId}?limit=${limit}&page=${page}`
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData.message);
      }

      const totalCount = response.headers.get("X-Total-Count");
      //   console.log(response.headers.get("X-Total-Count"));
      setTotalPostsCount(totalCount);
      setTotalPages(getPageCount(totalCount, limit));

      console.log(responseData.posts);
      setPostsLikesCount(responseData.likesCount);
      setLoadedPosts(responseData.posts);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const fetchCreator = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${params.userId}`
      );
      const responseData = await response.json();
      setLoadedCreator(responseData);
      console.log(loadedCreator);
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
        <>
          <div className={cl.creator__container}>
            <div className={cl.creator__header}>
              <div>
                <Avatar
                  image={
                    loadedCreator.image
                      ? process.env.REACT_APP_URL + loadedCreator.image
                      : "https://wallpapers.com/images/hd/anime-profile-picture-jioug7q8n43yhlwn.jpg"
                  }
                  alt="img"
                  width="12rem"
                  height="12rem"
                  // username={loadedCreator && loadedCreator.username}
                />
              </div>
              <h1>{loadedCreator.username}</h1>
            </div>
            <div className={cl.creator__posts__info}>
              <TbArticle />
              <span>{totalPostsCount}</span>
              <VscHeartFilled />
              <span>{postsLikesCount}</span>
            </div>
          </div>
        </>
      )}

      {isLoading && (
        <>
          <LoadingSpinner />
          <PostItemSkeleton itemsNumber={3} />
        </>
      )}
      {!isLoading && loadedPosts && <PostList items={loadedPosts} />}
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

export default UserPostsPage;
