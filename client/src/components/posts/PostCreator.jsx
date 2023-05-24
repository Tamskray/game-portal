import React, { useState, useEffect } from "react";
import { useHttpClient } from "../../hooks/http-hook";

import "./PostCreator.css";
import Avatar from "../UI/avatar/Avatar";

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

const PostCreator = ({ creatorId, date }) => {
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
          `http://localhost:5000/api/users/${creatorId}`
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
          <div className="creator__image">
            <Avatar
              image="https://wallpapers.com/images/hd/anime-profile-picture-jioug7q8n43yhlwn.jpg"
              alt={loadedCreator.username}
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
