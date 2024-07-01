import React from "react";

import { Post } from "../../../../types";

import PostItem from "../../PostItem/PostItem/PostItem";

interface Props {
  posts: Post[] | undefined;
  likesCount?: number | undefined;
}

const PostsList = ({ posts }: Props): React.ReactElement => {
  if (posts?.length === 0) {
    return <div>No posts</div>;
  }

  return (
    <ul>
      {posts?.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </ul>
  );
};

export default PostsList;
