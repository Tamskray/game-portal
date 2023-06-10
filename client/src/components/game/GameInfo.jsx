import React, { useContext } from "react";
import { AuthContext } from "../../context/auth-context";

import Button from "../UI/Button/Button";
import { useNavigate } from "react-router-dom";

const GameInfo = ({ cl, loadedGame }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className={cl.game__info}>
      <div>
        {auth.role === "ADMIN" && (
          <>
            <Button
              label="Редагувати"
              onClick={() => navigate(`/update-game/${loadedGame.game._id}`)}
            />
            <Button label="Видалити" danger />
          </>
        )}
      </div>

      <div className={cl.game__info__header}>
        <img
          src={process.env.REACT_APP_URL + loadedGame.game.image}
          alt={loadedGame.game.title}
        />
        <div>
          <div className={cl.game__title}>{loadedGame.game.title}</div>
          <div className={cl.game__developer}>{loadedGame.game.developer}</div>
        </div>
      </div>
      <div className={cl.game__description}>
        <div className={cl.game__description__item}>
          {loadedGame.game.description}
        </div>
        <div className={cl.game__description__item}>
          <p>Платформи:</p>
          {loadedGame.game.platforms}
        </div>
        <div className={cl.game__description__item}>
          <p>Дата виходу: </p>
          {loadedGame.game.date}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
