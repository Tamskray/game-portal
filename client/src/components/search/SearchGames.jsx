import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import cl from "./SearchGames.module.css";

const SearchGames = ({ closeModal }) => {
  const navigate = useNavigate();
  const [searchedGames, setSearchedGames] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const searchGames = async (search) => {
    const searchValue = search;
    setIsLoading(true);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/games/search?q=${searchValue}`
    );

    const responseData = await response.json();
    setSearchedGames(responseData);
    setIsLoading(false);
  };

  useEffect(() => {
    searchGames("");
  }, []);

  const onSearchItem = (gameId) => {
    navigate(`/game/${gameId}`);
    closeModal();
    setSearchedGames("");
  };

  return (
    <>
      <input
        className={cl.search__input}
        type="text"
        placeholder="Пошук гри.."
        onChange={(event) => searchGames(event.target.value)}
      />
      {!isLoading &&
        searchedGames &&
        Array.isArray(searchedGames) &&
        searchedGames.map((game) => (
          <div
            className={cl.search__item}
            key={game._id}
            onClick={() => onSearchItem(game._id)}
          >
            <div className={cl.search__game__image}>
              <img
                src={process.env.REACT_APP_URL + game.image}
                alt={game.title}
              />
            </div>
            <div className={cl.search__game__info}>
              <div>{game.title}</div>
              <div>{game.developer}</div>
            </div>
          </div>
        ))}
      {!isLoading && searchedGames && !Array.isArray(searchedGames) && (
        <div>{searchedGames}</div>
      )}
    </>
  );
};

export default SearchGames;
