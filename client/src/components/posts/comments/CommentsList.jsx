import React from "react";
import CommentItem from "./CommentItem";

const CommentsList = ({
  items,
  userCommentExist,
  deleteCommentHandler,
  activity,
}) => {
  // if (items.length === 0) {
  //   return (
  //     <div className="center">
  //       {/* <Card> */}
  //       <h2>Коментарів ще немає</h2>
  //       {/* </Card> */}
  //     </div>
  //   );
  // }

  return (
    <>
      <ul style={{ padding: 10, marginRight: 40 }}>
        {items.map((item) => (
          <CommentItem
            key={item._id}
            commentId={item._id}
            content={item.content}
            creatorId={item.creatorId}
            postId={item.postId}
            date={item.date}
            userCommentExist={userCommentExist}
            onDeleteComment={deleteCommentHandler}
            activity={activity}
          />
        ))}
      </ul>
    </>
  );
};

export default CommentsList;
