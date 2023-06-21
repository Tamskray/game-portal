import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../../hooks/http-hook";
import moment from "moment";
import { RiDeleteBin7Fill } from "react-icons/ri";
// moment().format();

import "./CommentItem.css";
import Avatar from "../../UI/avatar/Avatar";
import { AuthContext } from "../../../context/auth-context";
import { useNavigate } from "react-router-dom";

const CommentItem = ({
  commentId,
  content,
  creatorId,
  postId,
  date,
  userCommentExist,
  onDeleteComment,
  activity,
}) => {
  const [loadedCommentCreator, setLoadedCommentCreator] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommentCreator = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/${creatorId}`
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
        `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
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
                ? process.env.REACT_APP_URL + loadedCommentCreator.image
                : "https://cdn-icons-png.flaticon.com/512/5397/5397197.png"
            }
            alt={loadedCommentCreator && loadedCommentCreator.username}
          />
          {loadedCommentCreator && (
            <div className="comment__username">
              {loadedCommentCreator.username}
            </div>
          )}
        </div>
        {activity && (
          <div
            className="comment__activity"
            onClick={() => navigate(`/posts/${postId}`)}
          >
            Перейти до поста
          </div>
        )}
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
      <div className="comment__date">{publishedDate}</div>
    </div>
  );
};

export default CommentItem;
