import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Carousel from "nuka-carousel";
import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import GamePosts from "../components/game/GamePosts";
import GameInfo from "../components/game/GameInfo";
import GameAchievements from "../components/game/GameAchievements";
import {
  renderCenterLeftControls,
  renderCenterRightControls,
} from "../components/UI/carouselControls/CarouselControls";

import cl from "../styles/GamePage.module.css";

const GamePage = () => {
  const params = useParams();
  const [loadedGame, setLoadedGame] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchGame = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/games/${params.gameId}`
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

  // const [gameData, setGameData] = useGameInfo(loadedGame && loadedGame.title);

  // console.log(loadedGame?.steamGameDetailInfo[loadedGame.steamAppId].data);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedGame && (
        <>
          {loadedGame.steamGameDetailInfo && (
            <div className={cl.header__image}>
              <img
                src={
                  loadedGame?.steamGameDetailInfo[loadedGame.steamAppId].data
                    .background_raw
                }
              />
            </div>
          )}

          <GameInfo cl={cl} loadedGame={loadedGame} />

          {loadedGame.steamGameDetailInfo && (
            <div className={cl.game__carousel}>
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
          )}

          {loadedGame.achievements.game.availableGameStats && (
            <GameAchievements cl={cl} loadedGame={loadedGame} />
          )}

          <GamePosts postTitle={loadedGame.game.title} />
        </>
      )}
    </>
  );
};

export default GamePage;
