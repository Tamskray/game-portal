import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";

import { VscHeartFilled } from "react-icons/vsc";
import Modal from "../UI/modal/Modal";
import "./PostLike.css";
import Button from "../UI/Button/Button";

const PostLike = ({ likes, postId }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);
  const [isLiked, setIsLiked] = useState(Boolean(likes[auth.userId]));

  const [showModal, setShowModal] = useState(false);

  const fetchLikes = async () => {
    try {
      auth.token &&
        (await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
          method: "PATCH",
          body: JSON.stringify({
            userId: auth.userId,
          }),
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json; charset=utf-8",
          },
        })
          .then((res) => res.json())
          .then((res) => setLikeCount(Object.keys(res.likes).length)));

      setIsLiked(!isLiked);
    } catch (err) {
      console.log(err);
    }
  };

  const showModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const likeHandler = async (event) => {
    event.preventDefault();

    auth.isLoggedIn ? fetchLikes() : showModalHandler();
  };

  return (
    <>
      <Modal
        show={showModal}
        onCancel={closeModalHandler}
        footerClass="like__modal__actions"
        footer={
          <>
            <Button label="Назад" onClick={closeModalHandler} />
            <Button
              label="Увійти в акаунт"
              inverse
              onClick={() => navigate("/login")}
            />
          </>
        }
      >
        <p className="like__modal__content">
          Для вподобайок треба авторизуватись
        </p>
      </Modal>
      <div className="like__item">
        <VscHeartFilled
          className={`like__icon ${
            auth.isLoggedIn && isLiked && "like__color"
          }`}
          onClick={likeHandler}
        />
        {likeCount}
      </div>
    </>
  );
};

export default PostLike;
