import React from "react";
import PostItem from "./PostItem";

const PostList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="center">
        {/* <Card> */}
        <h2>Posts not found</h2>
        {/* </Card> */}
      </div>
    );
  }

  return (
    <>
      <ul style={{ padding: 0 }}>
        {items.map((post) => (
          <PostItem
            key={post._id}
            id={post._id}
            title={post.title}
            rubric={post.rubric}
            content={post.content}
            likes={post.likes}
            comments={post.comments}
            creator={post.creator}
            date={post.date}
          />
        ))}
      </ul>
    </>
  );
};

export default PostList;
