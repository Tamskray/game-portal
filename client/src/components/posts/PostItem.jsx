import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import Button from "../UI/Button/Button";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";

import { VscHeartFilled } from "react-icons/vsc";
import { BiCommentDetail } from "react-icons/bi";
import Avatar from "../UI/avatar/Avatar";

import "./PostItem.css";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${creator}`
        );

        setLoadedUser(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [sendRequest]);

  return (
    <>
      <div className="post__item">
        <img
          onClick={() => navigate(`/posts/${id}`)}
          src={
            image && image
              ? "http://localhost:5000/" + image
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
              <Avatar
                image="https://wallpapers.com/images/hd/anime-profile-picture-jioug7q8n43yhlwn.jpg"
                alt="img"
                width="2rem"
                height="2rem"
                username={loadedUser && loadedUser.username}
              />
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
          <Button label="Видалити" danger />
        </>
      )}

      <hr />
    </>
  );
};

export default PostItem;
