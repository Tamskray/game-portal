import React from "react";
import moment from "moment";
// moment().format();

import "./CommentItem.css";

const CommentItem = ({ content, creatorId, date }) => {
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

  return (
    <div className="comment__item">
      <div>{creatorId}</div>
      <p>{content}</p>
      <div style={{ marginTop: 20 }}>{publishedDate}</div>
    </div>
  );
};

export default CommentItem;
