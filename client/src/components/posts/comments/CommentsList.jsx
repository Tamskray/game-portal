import React from "react";
import CommentItem from "./CommentItem";

const CommentsList = ({ items, userCommentExist, deleteCommentHandler }) => {
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
            date={item.date}
            userCommentExist={userCommentExist}
            onDeleteComment={deleteCommentHandler}
          />
        ))}
      </ul>
    </>
  );
};

export default CommentsList;
