import React from "react";
import CommentItem from "./CommentItem";

const CommentsList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="center">
        {/* <Card> */}
        <h2>Коментарів ще немає</h2>
        {/* </Card> */}
      </div>
    );
  }

  return (
    <>
      <ul style={{ padding: 10 }}>
        {items.map((item) => (
          <CommentItem
            key={item._id}
            content={item.content}
            creatorId={item.creatorId}
            date={item.date}
          />
        ))}
      </ul>
    </>
  );
};

export default CommentsList;
