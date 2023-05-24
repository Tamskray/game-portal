import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";

import { VscHeartFilled } from "react-icons/vsc";
import "./PostLike.css";

const PostLike = ({ likes, postId }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);
  const [isLiked, setIsLiked] = useState(Boolean(likes[auth.userId]));

  const fetchLikes = async () => {
    try {
      auth.token &&
        (await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
          method: "PATCH",
          body: JSON.stringify({
            userId: auth.userId,
          }),
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json; charset=utf-8",
          },
        })
          .then((res) => res.json())
          .then((res) => setLikeCount(Object.keys(res.likes).length)));

      setIsLiked(!isLiked);
    } catch (err) {
      console.log(err);
    }
  };

  const likeHandler = async (event) => {
    event.preventDefault();

    auth.isLoggedIn ? fetchLikes() : navigate("/login");
  };

  return (
    <div className="like__item">
      <VscHeartFilled
        className={`like__icon ${isLiked && "like__color"}`}
        onClick={likeHandler}
      />
      {likeCount}
    </div>
  );
};

export default PostLike;
