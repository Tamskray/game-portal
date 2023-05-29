import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../../hooks/http-hook";
import moment from "moment";
import { RiDeleteBin7Fill } from "react-icons/ri";
// moment().format();

import "./CommentItem.css";
import Avatar from "../../UI/avatar/Avatar";
import { AuthContext } from "../../../context/auth-context";

const CommentItem = ({
  commentId,
  content,
  creatorId,
  date,
  userCommentExist,
  onDeleteComment,
}) => {
  const [loadedCommentCreator, setLoadedCommentCreator] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchCommentCreator = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${creatorId}`
        );

        // console.log(responseData);
        setLoadedCommentCreator(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCommentCreator();
  }, []);

  //   console.log(loadedCommentCreator);

  const commentDate = new Date(date);
  const dateNow = new Date();
  //   const publishedDate = `${dateNow.getHours() - commentDate.getHours()}`;
  let publishedDate;
  if (
    moment(dateNow).diff(commentDate, "days") === 0 &&
    moment(dateNow).diff(commentDate, "hours") !== 0
  ) {
    publishedDate = `${moment(dateNow).diff(commentDate, "hours")} годин тому`;
  } else if (moment(dateNow).diff(commentDate, "hours") === 0) {
    publishedDate = `${moment(dateNow).diff(commentDate, "minutes")} хв тому`;
  } else {
    publishedDate = `${moment(dateNow).diff(commentDate, "days")} днів тому`;
  }

  const confirmDeleteHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/comments/${commentId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      onDeleteComment(commentId);
    } catch (err) {
      console.log(err);
    }
    console.log("delete comment");
  };

  return (
    <div className={`comment ${userCommentExist && "exist__comment"}`}>
      <div className="comment__header">
        <div className="comment__image">
          <Avatar
            image={
              loadedCommentCreator && loadedCommentCreator.image
                ? "http://localhost:5000/" + loadedCommentCreator.image
                : "https://wallpapers.com/images/hd/anime-profile-picture-jioug7q8n43yhlwn.jpg"
            }
            alt={loadedCommentCreator && loadedCommentCreator.username}
          />
          {loadedCommentCreator && (
            <div className="comment__username">
              {loadedCommentCreator.username}
            </div>
          )}
        </div>
        {userCommentExist && (
          <RiDeleteBin7Fill
            className="bin__icon"
            onClick={confirmDeleteHandler}
          />
        )}
      </div>
      <div className="comment__content">
        <p>{content}</p>
      </div>
      <div style={{ marginTop: 20 }}>{publishedDate}</div>
    </div>
  );
};

export default CommentItem;
