import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Carousel from "nuka-carousel";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import GamePosts from "../components/game/GamePosts";
import {
  renderCenterLeftControls,
  renderCenterRightControls,
} from "../components/UI/carouselControls/CarouselControls";

import "../styles/GamePage.css";
const GamePage = () => {
  const params = useParams();
  const [loadedGame, setLoadedGame] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchGame = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/games/${params.gameId}`
      );

      const responseData = await response.json();
      setLoadedGame(responseData);

      console.log(responseData);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGame();
  }, [params.gameId]);

  //   const [gameData, setGameData] = useGameInfo(loadedGame && loadedGame.title);

  console.log(loadedGame?.steamGameDetailInfo[loadedGame.steamAppId].data);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedGame && (
        <div>
          <div className="header__image">
            <img
              src={
                loadedGame?.steamGameDetailInfo[loadedGame.steamAppId].data
                  .background_raw
              }
            />
          </div>
          <div className="game__info">
            <div className="game__title">{loadedGame.game.title}</div>
            <div className="game__developer">{loadedGame.game.developer}</div>
            <div className="game__description">
              <div className="game__description__item">
                {loadedGame.game.description}
              </div>
              <div className="game__description__item">
                <p>Платформи:</p>
                {loadedGame.game.platforms}
              </div>
              <div className="game__description__item">
                <p>Дата виходу: </p>
                {loadedGame.game.date}
              </div>
            </div>
          </div>

          <div className="game__carousel">
            <Carousel
              wrapAround
              autoplay
              autoplayInterval={5000}
              renderCenterLeftControls={renderCenterLeftControls}
              renderCenterRightControls={renderCenterRightControls}
            >
              {loadedGame?.steamGameDetailInfo[
                loadedGame.steamAppId
              ].data.screenshots.map((item) => (
                <div key={item.id}>
                  <img src={item.path_full} />
                </div>
              ))}
            </Carousel>
          </div>

          {loadedGame.achievements && (
            <>
              <h2>Досягення</h2>
              <div className="achievement__container">
                {loadedGame.achievements.game.availableGameStats.achievements.map(
                  (item) => (
                    <div key={item.name} className="achievement__item">
                      <div>
                        <img src={item.icon} alt={item.name} />
                      </div>
                      <div className="achievement__item__info">
                        <div>{item.displayName}</div>
                        <div className="achievement__item__description">
                          {item.description || "Secret"}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}

          <GamePosts postTitle={loadedGame.game.title} />
        </div>
      )}
    </>
  );
};

export default GamePage;
