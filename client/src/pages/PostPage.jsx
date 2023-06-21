import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";

import LoadingSpinner from "../components/UI/loadingSpinner/LoadingSpinner";
import PostCreator from "../components/posts/PostCreator";
import PostLike from "../components/posts/PostLike";
import PostComments from "../components/posts/PostComments";

import cl from "../styles/PostPage.module.css";

const PostPage = () => {
  const params = useParams();
  const [loadedPost, setLoadedPost] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/posts/${params.postId}`
        );
        setLoadedPost(responseData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [sendRequest, params.postId]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedPost && (
        <div className="post">
          <div className={cl.post__image__container}>
            {loadedPost.image && (
              <img
                className={cl.post__image}
                src={
                  loadedPost.image &&
                  process.env.REACT_APP_URL + loadedPost.image
                }
                alt="postImage"
              />
            )}
            <h1 className={cl.post__title}>{loadedPost.title}</h1>
          </div>

          {!loadedPost.image && <h1>{loadedPost.title}</h1>}

          <p>{loadedPost.description}</p>
          <PostCreator creatorId={loadedPost.creator} date={loadedPost.date} />
          <hr style={{ marginTop: 10 }} />

          <div
            className={cl.post__content}
            dangerouslySetInnerHTML={{ __html: loadedPost.content }}
          >
            {/* <p>{loadedPost.content}</p> */}
          </div>
          <hr style={{ marginBottom: 10 }} />
          <PostLike likes={loadedPost.likes} postId={loadedPost._id} />
          <PostComments
            postId={loadedPost._id}
            comments={loadedPost.comments}
          />
        </div>
      )}
    </>
  );
};

export default PostPage;
