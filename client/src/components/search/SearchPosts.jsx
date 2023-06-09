import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import cl from "./SearchPosts.module.css";

const SearchPosts = ({ closeModal }) => {
  const navigate = useNavigate();
  const [searchedPosts, setSearchedPosts] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const searchPosts = async (search) => {
    const searchValue = search;
    setIsLoading(true);

    const response = await fetch(
      `http://localhost:5000/api/posts/search?q=${searchValue}`
    );

    const responseData = await response.json();
    setSearchedPosts(responseData);
    setIsLoading(false);
    // console.log(searchedPosts);
  };

  useEffect(() => {
    searchPosts("");
  }, []);

  const onSearchItem = (postId) => {
    navigate(`/posts/${postId}`);
    closeModal();
    setSearchedPosts("");
  };

  return (
    <>
      <input
        className={cl.search__input}
        type="text"
        placeholder="Пошук постів.."
        onChange={(event) => searchPosts(event.target.value)}
      />
      {!isLoading &&
        searchedPosts &&
        Array.isArray(searchedPosts) &&
        searchedPosts.map((post) => (
          <div
            className={cl.search__item}
            key={post._id}
            onClick={() => onSearchItem(post._id)}
          >
            <div>{post.title}</div>
            <div className={cl.search__item__description}>
              {post.description}
            </div>
          </div>
        ))}
      {!isLoading && searchedPosts && !Array.isArray(searchedPosts) && (
        <div>{searchedPosts}</div>
      )}
    </>
  );
};

export default SearchPosts;
