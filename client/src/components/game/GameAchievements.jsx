import React from "react";

const GameAchievements = ({ cl, loadedGame }) => {
  return (
    <>
      <h2>Досягення</h2>
      <div className={cl.achievement__container}>
        {loadedGame.achievements.game.availableGameStats.achievements.map(
          (item) => (
            <div key={item.name} className={cl.achievement__item}>
              <div>
                <img src={item.icon} alt={item.name} />
              </div>
              <div className={cl.achievement__item__info}>
                <div>{item.displayName}</div>
                <div className={cl.achievement__item__description}>
                  {item.description || "Secret"}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default GameAchievements;
