import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../hooks/http-hook";
import Button from "../UI/Button/Button";
import { AuthContext } from "../../context/auth-context";
import LoadingSpinner from "../UI/loadingSpinner/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";

import "./PostItem.css";

const PostItem = ({
  id,
  title,
  rubric,
  content,
  likes,

  creator,
  date,
}) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loadedUser, setLoadedUser] = useState();
  const [loadedComments, setLoadedComments] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const isLiked = Boolean(likes[auth.userId]);
  // const likeCount = Object.keys(likes).length;

  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);

  // console.log(isLiked);

  // console.log(auth.role);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/${creator}`
        );

        // console.log(responseData);

        setLoadedUser(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchComments = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/comments/post/${id}`
        );

        setLoadedComments(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
    fetchComments();
  }, []);
  // [sendRequest]

  const postLike = useCallback(async () => {
    try {
      await fetch(`http://localhost:5000/api/posts/${id}/like`, {
        method: "PATCH",
        body: JSON.stringify({
          userId: auth.userId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
      })
        .then((res) => res.json())
        .then((res) => setLikeCount(Object.keys(res.likes).length));
    } catch (err) {
      console.log(err);
    }
  }, []);

  const likeHandler = async (event) => {
    event.preventDefault();

    auth.isLoggedIn ? postLike() : navigate("/login");
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="post__item">
          <p>id: {id}</p>
          <div className="post__content">
            <Link to={`/posts/${id}`}>
              <div className="post__title">{title}</div>
            </Link>
            <div className="post__rubric">{rubric}</div>
            <div className="post__description">{content}</div>
            <p>{date}</p>
            {loadedUser && (
              <div>
                <p>Post by {loadedUser.username}</p>
                {loadedUser.posts.map((post) => (
                  <p key={post}>Post: {post}</p>
                ))}
              </div>
            )}
          </div>
          <div>
            Likes: {likeCount}
            <Button label="like" onClick={likeHandler} />
          </div>
          {loadedComments && (
            <div>
              {loadedComments.map((comment) => (
                <div key={comment._id}>{comment.content}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PostItem;
