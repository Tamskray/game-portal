import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/auth-context";

import Button from "../UI/Button/Button";
import { useNavigate } from "react-router-dom";
import { GrClose } from "react-icons/gr";

import { redirect } from "react-router-dom";

import Modal from "../UI/modal/Modal";

import clIcon from "../posts/PostItemIcon.module.css";

const GameInfo = ({ cl, loadedGame }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmDeleteModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmDeleteModal(false);

    await fetch(
      `${process.env.REACT_APP_API_URL}/games/${loadedGame.game._id}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + auth.token },
      }
    );

    redirect("");
  };

  const deleteModalHeader = (
    <div className={clIcon.modal__header}>
      <div>Ви впевнені?</div>
      <GrClose className={clIcon.close__icon} onClick={cancelDeleteHandler} />
    </div>
  );

  return (
    <>
      <Modal
        show={showConfirmDeleteModal}
        onCancel={cancelDeleteHandler}
        header={deleteModalHeader}
      >
        <p>
          Хочете продовжити і видалити дані про гру{" "}
          <span style={{ color: "#6b9bda" }}>{loadedGame.game.title}</span>?
          Зверніть увагу, що неможливо скасувати дії після цього!
        </p>
        <div className="center">
          <Button
            label={`Видалити дані про гру`}
            danger
            size="big"
            onClick={confirmDeleteHandler}
          />
        </div>
      </Modal>

      <div className={cl.game__info}>
        <div>
          {auth.role === "ADMIN" && (
            <>
              <Button
                label="Редагувати"
                onClick={() => navigate(`/update-game/${loadedGame.game._id}`)}
              />
              <Button
                label="Видалити"
                danger
                onClick={showDeleteWarningHandler}
              />
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
            <div className={cl.game__developer}>
              {loadedGame.game.developer}
            </div>
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
            {loadedGame.game.date.split("T")[0]}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameInfo;
