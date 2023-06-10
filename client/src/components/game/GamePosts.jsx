import React, { useState, useEffect } from "react";
import PostList from "../posts/PostList";

import cl from "./GamePosts.module.css";

const GamePosts = ({ postTitle }) => {
  const [searchedPosts, setSearchedPosts] = useState();

  const searchPosts = async () => {
    const response = await fetch(
      `http://localhost:5000/api/posts/search?q=${postTitle}`
    );

    const responseData = await response.json();

    setSearchedPosts(responseData);
  };

  useEffect(() => {
    searchPosts();
  }, []);

  console.log(searchedPosts);

  return (
    <>
      {searchedPosts && Array.isArray(searchedPosts) && (
        <div className={cl.searched__game__posts}>
          <h2>Пости пов'язані з {postTitle}</h2>
          <PostList items={searchedPosts} />
        </div>
      )}
      {searchPosts && !Array.isArray(searchedPosts) && (
        <div className={cl.searched__game__posts}>
          Не знайдено постів пов'язаних з {postTitle}
        </div>
      )}
    </>
  );
};

export default GamePosts;
