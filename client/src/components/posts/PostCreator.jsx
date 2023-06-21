import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../hooks/http-hook";

import "./PostCreator.css";
import Avatar from "../UI/avatar/Avatar";
import { useNavigate } from "react-router-dom";

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

const PostCreator = ({ creatorId, date, avatarWidth, avatarHeight }) => {
  const navigate = useNavigate();
  const [loadedCreator, setLoadedCreator] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const postDate = new Date(date);
  const publishedDate = `${postDate.getDate()} ${
    monthNames[postDate.getMonth()]
  }, ${postDate.getFullYear()} ${postDate.getHours()}:${postDate.getMinutes()}`;

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/${creatorId}`
        );
        setLoadedCreator(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCreator();
  }, [sendRequest]);

  return (
    <>
      {!isLoading && loadedCreator && (
        <div>
          <div
            className="creator__image"
            onClick={() => navigate(`/${creatorId}/posts`)}
          >
            <Avatar
              image={
                loadedCreator.image && loadedCreator.image
                  ? process.env.REACT_APP_URL + loadedCreator.image
                  : "https://cdn-icons-png.flaticon.com/512/5397/5397197.png"
              }
              alt={loadedCreator.username}
              width={avatarWidth}
              height={avatarHeight}
            />
            <div className="creator__name">
              Автор: {loadedCreator.username} | Опубліковано: {publishedDate}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCreator;
