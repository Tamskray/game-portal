import React from "react";

import { Likes } from "../../../../types";

import { monthNames } from "../constants";

import PostAuthor from "../PostAuthor/PostAuthor";

import { VscHeartFilled } from "react-icons/vsc";
import { BiCommentDetail } from "react-icons/bi";

interface Props {
  creator: string;
  date: string;
  likes: Likes;
  comments: string[];
}

const PostDetails = ({
  creator,
  date,
  likes,
  comments,
}: Props): React.ReactElement => {
  const likeCount = Object.keys(likes).length;

  const postDate = new Date(date);
  const publishedDate = `${postDate.getDate()} ${
    monthNames[postDate.getMonth()]
  }, ${postDate.getFullYear()}`;

  return (
    <div className="post__details">
      <PostAuthor creator={creator} />

      <time dateTime={date}>{publishedDate}</time>

      <div className="post__icons" aria-label="likes count">
        <VscHeartFilled />
        <span>{likeCount}</span>
      </div>
      <div className="post__icons" aria-label="comments count">
        <BiCommentDetail />
        <span>{comments.length}</span>
      </div>
    </div>
  );
};

export default PostDetails;
