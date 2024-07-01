import React from "react";
import { useNavigate, Link } from "react-router-dom";

import { Post } from "../../../../types";

import { defaultPostImage } from "../constants";

import PostDetails from "../PostDetails/PostDetails";
import "./PostItem.css";

interface Props {
  post: Post;
  likesCount?: number | undefined;
}

const PostItem = ({ post }: Props): React.ReactElement => {
  const {
    _id: id,
    title,
    rubric,
    description,
    creator,
    comments,
    date,
    likes,
    image,
  } = post;

  const navigate = useNavigate();

  return (
    <li aria-label={`Post-${title}`}>
      <article className="post__item">
        <img
          onClick={() => navigate(`/posts/${id}`)}
          src={image ? import.meta.env.VITE_APP_URL + image : defaultPostImage}
          alt={`${title}-post-image`}
        />

        <div className="post__content">
          <div className="post__rubric">{rubric}</div>
          <Link to={`/posts/${id}`}>
            <h2 className="post__title">{title}</h2>
          </Link>
          <p className="post__description">{description}</p>

          <PostDetails
            creator={creator}
            date={date}
            likes={likes}
            comments={comments}
          />
        </div>
      </article>
    </li>
  );
};

export default PostItem;
