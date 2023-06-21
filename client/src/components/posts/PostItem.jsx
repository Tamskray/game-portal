import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import Button from "../UI/Button/Button";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";

import { VscHeartFilled } from "react-icons/vsc";
import { BiCommentDetail } from "react-icons/bi";
import Avatar from "../UI/avatar/Avatar";
import { GrClose } from "react-icons/gr";

import "./PostItem.css";
import Modal from "../UI/modal/Modal";

import cl from "./PostItemIcon.module.css";

const monthNames = [
  "Січня",
  "Лютого",
  "Березня",
  "Квітня",
  "Травня",
  "Червня",
  "Липня",
  "Серпня",
  "Вересня",
  "Жовтня",
  "Листопада",
  "Грудня",
];

const PostItem = ({
  id,
  title,
  rubric,
  description,
  content,
  likes,
  comments,
  creator,
  date,
  image,
}) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadedUser, setLoadedUser] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);

  const postDate = new Date(date);
  const publishedDate = `${postDate.getDate()} ${
    monthNames[postDate.getMonth()]
  }, ${postDate.getFullYear()}`;

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/${creator}`
        );

        setLoadedUser(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [sendRequest]);

  const showDeleteWarningHandler = () => {
    setShowConfirmDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmDeleteModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmDeleteModal(false);

    await fetch(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + auth.token },
    });
  };

  const deleteModalHeader = (
    <div className={cl.modal__header}>
      <div>Ви впевнені?</div>
      <GrClose className={cl.close__icon} onClick={cancelDeleteHandler} />
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
          Хочете продовжити і видалити публікацію{" "}
          <span style={{ color: "#6b9bda" }}>{title}</span>? Зверніть увагу, що
          неможливо скасувати дії після цього!
        </p>
        <div className="center">
          <Button
            label={`Видалити публікацію`}
            danger
            size="big"
            onClick={confirmDeleteHandler}
          />
        </div>
      </Modal>
      <div className="post__item">
        <img
          onClick={() => navigate(`/posts/${id}`)}
          src={
            image && image
              ? process.env.REACT_APP_URL + image
              : "https://external-preview.redd.it/s40RczXEeh8Q0z6sc-u8cFFCpYdoUsjOpY9-Z-CDjms.jpg?auto=webp&s=7b5c42fc8df7cb5730705fd3e70a65f51750056e"
          }
        />
        <div className="post__content">
          <div className="post__rubric">{rubric}</div>
          <Link to={`/posts/${id}`}>
            <div className="post__title">{title}</div>
          </Link>
          <div className="post__description">{description}</div>
          <div className="post__footer">
            <div
              className="post__creator"
              onClick={() => navigate(`/${creator}/posts`)}
            >
              {isLoading && <div>Loading..</div>}
              {loadedUser && (
                <Avatar
                  image={
                    loadedUser.image
                      ? process.env.REACT_APP_URL + loadedUser.image
                      : "https://cdn-icons-png.flaticon.com/512/5397/5397197.png"
                  }
                  alt="img"
                  width="2rem"
                  height="2rem"
                  username={loadedUser && loadedUser.username}
                />
              )}
            </div>
            <span>{publishedDate}</span>
            <div className="post__icons">
              <VscHeartFilled />
              <span>{likeCount}</span>
            </div>
            <div className="post__icons">
              <BiCommentDetail />
              <span>{comments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {auth.userId === creator && (
        <>
          <Button
            label="Редагувати"
            onClick={() => navigate(`/update-posts/${id}`)}
          />
          <Button label="Видалити" danger onClick={showDeleteWarningHandler} />
        </>
      )}

      <hr />
    </>
  );
};

export default PostItem;
